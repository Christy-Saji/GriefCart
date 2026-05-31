import { getCached, setCached } from '@/lib/cache'
import type { ScrapeResult } from '@/lib/types'

const scrapeUrl = async (url: string): Promise<ScrapeResult> => {
  const cached = getCached(url)
  if (cached) return { url, content: cached, status: 'ok' }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch('https://api.anakin.io/v1/scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ANAKIN_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        useBrowser: false,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const content = data.markdown || data.content || ''
    const status: ScrapeResult['status'] = content.length > 100 ? 'ok' : 'partial'
    if (content.length > 0) setCached(url, content)
    return { url, content, status }
  } catch {
    return { url, content: '', status: 'failed' }
  }
}

export const scrapeUrls = async (urls: string[]): Promise<ScrapeResult[]> => {
  const results = await Promise.allSettled(urls.map(scrapeUrl))
  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { url: urls[i], content: '', status: 'failed' as const }
  )
}

export { scrapeUrl }
