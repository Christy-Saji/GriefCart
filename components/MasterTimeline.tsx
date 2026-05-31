'use client'

import type { ChecklistCard } from '@/lib/types'

interface Props {
  cards: ChecklistCard[]
}

const urgencyGroup = (priority: number) => {
  if (priority <= 2) return 'Do this week'
  if (priority === 3) return 'Do this month'
  return 'When ready'
}

const urgencyColor = (priority: number) => {
  if (priority <= 2) return { dot: '#E76F51', label: 'bg-orange-50 text-orange-800 border-orange-200' }
  if (priority === 3) return { dot: '#2D6A4F', label: 'bg-green-50 text-green-800 border-green-200' }
  return { dot: '#6B7280', label: 'bg-gray-50 text-gray-600 border-gray-200' }
}

export default function MasterTimeline({ cards }: Props) {
  const top = [...cards].sort((a, b) => a.priority - b.priority).slice(0, 5)

  return (
    <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6 mb-6">
      <h2 className="text-base font-medium text-[#1A1A1A] mb-4">Where to begin</h2>
      <ol className="space-y-0">
        {top.map((card, i) => {
          const { dot, label } = urgencyColor(card.priority)
          const group = urgencyGroup(card.priority)
          return (
            <li key={card.assetId} className="flex gap-4 group">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                  style={{ background: dot }}
                >
                  {i + 1}
                </div>
                {i < top.length - 1 && (
                  <div className="w-px flex-1 bg-[#E8E8E8] my-1" style={{ minHeight: 20 }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-[#1A1A1A]">{card.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${label}`}>{group}</span>
                </div>
                <span className="text-xs text-[#6B7280]">
                  {card.withNominee?.timeline ?? 'Timeline varies'}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
