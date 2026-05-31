'use client'

interface Props {
  total: number
  completed: number
}

export default function ChecklistProgress({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="sticky-progress bg-white border-b border-[#E8E8E8] px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#6B7280]">
          {completed} of {total} tasks completed
        </span>
        <span className="text-xs font-medium text-[#2D6A4F]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
