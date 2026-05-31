import { getCached, setCached } from '@/lib/cache'
import type { ScrapeResult } from '@/lib/types'

const scrapeUrl = async (url: string): Promise<ScrapeResult> => {
  const cached = getCached(url)
  if (cached) return { url, content: cached, status: 'ok' }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch('https://api.anakin.io/v1/url-scraper', {
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
    const initialData = await response.json()
    const jobId = initialData.jobId

    if (!jobId) throw new Error('No jobId returned from Anakin')

    // Poll until completed
    let attempts = 0
    let content = ''
    let status: ScrapeResult['status'] = 'failed'

    while (attempts < 15) {
      await new Promise((r) => setTimeout(r, 1000))

      const pollRes = await fetch(`https://api.anakin.io/v1/url-scraper/${jobId}`, {
        headers: {
          Authorization: `Bearer ${process.env.ANAKIN_API_KEY}`,
        },
      })

      if (!pollRes.ok) throw new Error(`Poll HTTP ${pollRes.status}`)
      const pollData = await pollRes.json()

      if (pollData.status === 'completed') {
        content = pollData.markdown || pollData.content || ''
        status = content.length > 100 ? 'ok' : 'partial'
        break
      } else if (pollData.status === 'failed') {
        throw new Error('Anakin scraper job failed')
      }

      attempts++
    }

    if (content.length > 0) setCached(url, content)

    const result = { url, content, status }
    if (process.env.NODE_ENV === 'development') {
      console.log(`SCRAPE [${url.slice(0, 60)}] status:`, result.status)
      console.log(`SCRAPE content length:`, result.content.length)
    }
    return result
  } catch (err) {
    console.error('SCRAPE ERROR for URL:', url, err)
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
