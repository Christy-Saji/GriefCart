'use client'

interface Props {
  status: 'failed' | 'partial'
  url: string
}

export default function ScrapeWarningBanner({ status, url }: Props) {
  const institution = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  })()

  return (
    <div className="flex items-start gap-3 rounded-md bg-[#FFF8E1] border border-amber-200 px-4 py-3 mb-4">
      <span className="text-amber-600 mt-0.5 flex-shrink-0">⚠</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-900 leading-relaxed">
          {status === 'failed'
            ? `We couldn't fetch the latest info from ${institution}. The details below follow standard procedure — verify directly before acting.`
            : `We could only partially retrieve information from ${institution}. The details below may be incomplete — verify directly before acting.`}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-700 underline mt-1 inline-block hover:text-amber-900"
        >
          View official page →
        </a>
      </div>
    </div>
  )
}
