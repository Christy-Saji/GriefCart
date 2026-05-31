'use client'

import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Check, Copy, FileText } from 'lucide-react'
import type { ChecklistCard } from '@/lib/types'
import ScrapeWarningBanner from './ScrapeWarningBanner'

interface Props {
  card: ChecklistCard
  isChecked: boolean
  onToggle: () => void
}

export default function AssetCard({ card, isChecked, onToggle }: Props) {
  const [activeTab, setActiveTab] = useState<'nominee' | 'noNominee'>('nominee')
  const [mistakesOpen, setMistakesOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const branch = activeTab === 'nominee' ? card.withNominee : card.withoutNominee

  const handleCopy = () => {
    const text = [
      card.title,
      '',
      activeTab === 'nominee' ? 'With Nominee:' : 'Without Nominee:',
      ...(branch?.steps?.map((s, i) => `${i + 1}. ${s}`) ?? []),
      '',
      'Documents needed:',
      ...(branch?.documents?.map((d) => `• ${d}`) ?? []),
      '',
      `Timeline: ${branch?.timeline ?? 'varies'}`,
      card.deadline ? `\nDeadline: ${card.deadline}` : '',
      `\nOfficial portal: ${card.portal?.url ?? ''}`,
    ]
      .filter((l) => l !== undefined)
      .join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isPriority1 = card.priority === 1
  const isPriority2 = card.priority === 2

  return (
    <div
      className={`asset-card bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200 ${
        isChecked ? 'opacity-60' : ''
      } ${isPriority1 ? 'border-[#E76F51]/30' : 'border-[#E8E8E8]'}`}
      style={{ borderLeftWidth: 3, borderLeftColor: isChecked ? '#6B7280' : '#2D6A4F' }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start gap-3">
          {/* Check toggle */}
          <button
            onClick={onToggle}
            aria-label={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
              isChecked
                ? 'bg-[#2D6A4F] border-[#2D6A4F]'
                : 'border-[#E8E8E8] hover:border-[#2D6A4F]'
            }`}
          >
            {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-[#1A1A1A]">{card.title}</h3>
              {isPriority1 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-amber-200">
                  Do this first
                </span>
              )}
              {isPriority2 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-amber-200">
                  Do soon
                </span>
              )}
            </div>

            {card.deadline && (
              <p className="text-xs text-[#E76F51] mb-2">⏱ {card.deadline}</p>
            )}

            {/* Scrape warning */}
            {(card.scrapeStatus === 'failed' || card.scrapeStatus === 'partial') && (
              <ScrapeWarningBanner
                status={card.scrapeStatus}
                url={card.scrapedUrls?.[0] ?? card.portal?.url ?? ''}
              />
            )}

            {/* Tabs */}
            <div className="flex gap-0 border border-[#E8E8E8] rounded-md overflow-hidden mt-3 w-fit">
              <button
                onClick={() => setActiveTab('nominee')}
                className={`text-xs px-3 py-1.5 transition-colors duration-150 ${
                  activeTab === 'nominee'
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-white text-[#6B7280] hover:bg-[#FAFAF8]'
                }`}
              >
                With Nominee
              </button>
              <button
                onClick={() => setActiveTab('noNominee')}
                className={`text-xs px-3 py-1.5 border-l border-[#E8E8E8] transition-colors duration-150 ${
                  activeTab === 'noNominee'
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-white text-[#6B7280] hover:bg-[#FAFAF8]'
                }`}
              >
                Without Nominee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Branch content */}
      {branch && (
        <div className="px-6 pb-4 border-t border-[#E8E8E8] pt-4">
          {/* Steps */}
          {branch.steps?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">Steps</p>
              <ol className="space-y-2">
                {branch.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F0F7F4] text-[#2D6A4F] text-xs flex items-center justify-center font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#1A1A1A] leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Documents */}
          {branch.documents?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                Documents needed
              </p>
              <ul className="space-y-1.5">
                {branch.documents.map((doc, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <FileText size={13} className="text-[#2D6A4F] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#1A1A1A]">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {branch.timeline && (
            <p className="text-xs text-[#6B7280]">
              <span className="font-medium">Timeline:</span> {branch.timeline}
            </p>
          )}
        </div>
      )}

      {/* Common mistakes */}
      {card.commonMistakes?.length > 0 && (
        <div className="border-t border-[#E8E8E8]">
          <button
            onClick={() => setMistakesOpen((o) => !o)}
            className="collapsed-section w-full flex items-center justify-between px-6 py-3 text-xs text-[#6B7280] hover:bg-[#FAFAF8] transition-colors"
          >
            <span>Most people forget this step</span>
            {mistakesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {mistakesOpen && (
            <div className="px-6 pb-4">
              <ul className="space-y-1.5">
                {card.commonMistakes.map((m, i) => (
                  <li key={i} className="text-sm text-[#1A1A1A] flex gap-2 items-start">
                    <span className="text-[#E76F51] flex-shrink-0 mt-0.5">•</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#E8E8E8] px-6 py-3 flex items-center justify-between gap-3 bg-[#FAFAF8]">
        {card.portal?.url && (
          <a
            href={card.portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] hover:underline"
          >
            {card.portal.name ?? 'Official Portal'}
            <ExternalLink size={11} />
          </a>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          {copied ? <Check size={13} className="text-[#2D6A4F]" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy this section'}
        </button>
      </div>
    </div>
  )
}
