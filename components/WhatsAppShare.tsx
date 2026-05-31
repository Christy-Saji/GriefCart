'use client'

import { MessageCircle } from 'lucide-react'
import type { ChecklistCard } from '@/lib/types'

interface Props {
  cards: ChecklistCard[]
}

export default function WhatsAppShare({ cards }: Props) {
  const handleShare = () => {
    const top3 = [...cards].sort((a, b) => a.priority - b.priority).slice(0, 3)
    const lines = top3
      .map((c, i) => `${i + 1}. ${c.title} — ${c.withNominee?.timeline ?? 'timeline varies'}`)
      .join('\n')
    const summary = `GriefCart Checklist\n\n${lines}\n\nFull checklist: griefcart.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="whatsapp-btn fixed bottom-6 right-6 z-20 flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-4 py-3 rounded-full shadow-lg hover:bg-[#20B858] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Share checklist on WhatsApp"
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Share on WhatsApp</span>
    </button>
  )
}
