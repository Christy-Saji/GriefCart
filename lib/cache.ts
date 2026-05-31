const scrapeCache = new Map<string, { content: string; ts: number }>()
const TTL = 30 * 60 * 1000 // 30 minutes

export const getCached = (url: string): string | null => {
  const entry = scrapeCache.get(url)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) {
    scrapeCache.delete(url)
    return null
  }
  return entry.content
}

export const setCached = (url: string, content: string): void => {
  scrapeCache.set(url, { content, ts: Date.now() })
}
