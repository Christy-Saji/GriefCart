import { scrapeUrls } from '@/lib/scraper'
import { getScrapeUrls } from '@/lib/scrapeMap'
import { getFallback } from '@/lib/fallbackData'
import { buildBatchPrompt } from '@/lib/promptBuilder'
import { callGeminiBatch } from '@/lib/gemini'
import { acquireLock, releaseLock } from '@/lib/rateLimiter'
import type { UserInput } from '@/lib/types'

function hashInput(input: UserInput): string {
  return Buffer.from(JSON.stringify(input)).toString('base64').slice(0, 32)
}

export async function POST(request: Request) {
  let sessionKey = ''

  try {
    const body: UserInput = await request.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('=== GRIEFCART DEBUG ===')
      console.log('ANAKIN_API_KEY present:', !!process.env.ANAKIN_API_KEY)
      console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY)
      console.log('ANAKIN_API_KEY prefix:', process.env.ANAKIN_API_KEY?.slice(0, 8))
      console.log('GEMINI_API_KEY prefix:', process.env.GEMINI_API_KEY?.slice(0, 8))
      console.log('Assets received:', body.assets)
      console.log('State received:', body.state)
    }

    sessionKey = hashInput(body)

    if (!acquireLock(sessionKey)) {
      return Response.json(
        { error: 'A request is already in progress. Please wait.' },
        { status: 429 }
      )
    }

    // 1. Map each selected asset to its scrape URLs
    const assetScrapeTargets = body.assets.map((assetId) => ({
      assetId,
      urls: getScrapeUrls(assetId, body.state),
    }))

    // 2. Collect all unique URLs across all assets
    const allUrls = Array.from(new Set(assetScrapeTargets.flatMap((a) => a.urls)))

    // 3. Scrape all URLs in parallel
    const scrapeResults = await scrapeUrls(allUrls)
    const scrapeMap = new Map(scrapeResults.map((r) => [r.url, r]))

    // 4. Build per-asset content objects for the batch prompt
    const assetContents = assetScrapeTargets.map(({ assetId, urls }) => {
      const assetScrapes = urls.map(
        (url) => scrapeMap.get(url) ?? { url, content: '', status: 'failed' as const }
      )
      const allFailed = assetScrapes.every((s) => s.status === 'failed')
      const content = allFailed
        ? getFallback(assetId).summary
        : assetScrapes
            .filter((s) => s.content.length > 0)
            .map((s) => s.content)
            .join('\n\n---\n\n')

      return { assetId, content }
    })

    // 5. Single batched Gemini call for ALL assets at once
    console.log(`Calling Gemini once for ${assetContents.length} assets...`)
    const prompt = buildBatchPrompt(assetContents, body)
    let geminiCards: any[] = []

    try {
      geminiCards = await callGeminiBatch(prompt)
    } catch (err) {
      console.error('Gemini batch call failed:', err)
      // geminiCards stays empty — will use fallbacks for all
    }

    // 6. Merge Gemini results with scrape metadata, falling back if needed
    const cards = assetScrapeTargets.map(({ assetId, urls }) => {
      const assetScrapes = urls.map(
        (url) => scrapeMap.get(url) ?? { url, content: '', status: 'failed' as const }
      )
      const allFailed = assetScrapes.every((s) => s.status === 'failed')
      const anyFailed = assetScrapes.some((s) => s.status === 'failed')
      const scrapeStatus = allFailed ? 'failed' : anyFailed ? 'partial' : 'ok'

      // Find the matching card from Gemini's batch response
      const geminiCard = geminiCards.find((c) => c?.assetId === assetId)

      if (!geminiCard) {
        const fallback = getFallback(assetId)
        return {
          assetId,
          scrapeStatus,
          scrapedUrls: urls,
          error: true,
          portal: { name: fallback.portalName, url: fallback.officialUrl },
        }
      }

      return {
        ...geminiCard,
        assetId,
        scrapeStatus,
        scrapedUrls: urls,
      }
    })

    // 7. Sort by priority
    const sortedCards = [...cards].sort((a, b) => ((a as any).priority ?? 5) - ((b as any).priority ?? 5))

    // 8. Build master timeline
    const masterTimeline = sortedCards
      .slice(0, 5)
      .map((c: any) => `${c.title ?? c.assetId} — ${c.withNominee?.timeline ?? 'timeline varies'}`)

    return Response.json({
      cards: sortedCards,
      masterTimeline,
      disclaimer:
        'Information is AI-summarised from official sources. Verify directly before acting.',
      generatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('ROUTE ERROR:', err)
    return Response.json(
      {
        error:
          'This is taking longer than expected. Please try again — it usually works on the second attempt.',
      },
      { status: 504 }
    )
  } finally {
    if (sessionKey) releaseLock(sessionKey)
  }
}
