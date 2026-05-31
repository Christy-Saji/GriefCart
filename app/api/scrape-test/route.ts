import { scrapeUrl } from '@/lib/scraper'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') ?? 'https://licindia.in/claim-procedure'

  const result = await scrapeUrl(url)
  return Response.json({
    status: result.status,
    contentLength: result.content.length,
    preview: result.content.slice(0, 500),
  })
}
