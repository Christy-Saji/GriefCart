'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Printer } from 'lucide-react'
import type { ChecklistResponse } from '@/lib/types'
import { useChecklist } from '@/hooks/useChecklist'
import AssetCard from '@/components/AssetCard'
import ErrorCard from '@/components/ErrorCard'
import MasterTimeline from '@/components/MasterTimeline'
import ChecklistProgress from '@/components/ChecklistProgress'
import WhatsAppShare from '@/components/WhatsAppShare'
import Disclaimer from '@/components/Disclaimer'
import { assetsConfig } from '@/config/assets.config'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ChecklistResponse | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('griefcart_result')
      if (!raw) { router.replace('/form'); return }
      const parsed: ChecklistResponse = JSON.parse(raw)
      setResult(parsed)
      if (parsed.cards?.length) setActiveSection((parsed.cards[0] as any).assetId)
    } catch {
      router.replace('/form')
    }
  }, [router])

  // Intersection observer to highlight sidebar item
  useEffect(() => {
    if (!result) return
    const observers: IntersectionObserver[] = []
    result.cards.forEach((card: any) => {
      const el = cardRefs.current[card.assetId]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(card.assetId) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [result])

  const { checkedItems, toggleItem, getCompletedCount } = useChecklist(
    result?.cards ?? []
  )

  const scrollToCard = (assetId: string) => {
    const el = cardRefs.current[assetId]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Loading your checklist…</p>
      </div>
    )
  }

  const validCards = result.cards.filter((c: any) => !c.error)
  const errorCards = result.cards.filter((c: any) => c.error)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-[#E8E8E8] bg-white flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="text-base font-medium text-[#1A1A1A] tracking-tight hover:opacity-70 transition-opacity">
          GriefCart
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          <Printer size={15} />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 gap-8">
        {/* Sidebar */}
        <aside className="sidebar hidden lg:flex flex-col w-52 flex-shrink-0">
          <div className="sticky top-20">
            <ChecklistProgress total={result.cards.length} completed={getCompletedCount()} />
            <nav className="mt-4 space-y-0.5" aria-label="Jump to section">
              {result.cards.map((card: any) => {
                const assetLabel = assetsConfig.find((a) => a.id === card.assetId)?.label ?? card.title ?? card.assetId
                const isActive = activeSection === card.assetId
                return (
                  <button
                    key={card.assetId}
                    onClick={() => scrollToCard(card.assetId)}
                    className={`w-full text-left text-xs px-3 py-2 rounded transition-colors duration-150 leading-snug ${
                      isActive
                        ? 'bg-[#F0F7F4] text-[#2D6A4F] font-medium'
                        : 'text-[#6B7280] hover:bg-[#FAFAF8] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {card.error ? assetLabel : (card.title ?? assetLabel)}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile progress */}
          <div className="lg:hidden mb-4">
            <ChecklistProgress total={result.cards.length} completed={getCompletedCount()} />
          </div>

          <MasterTimeline cards={validCards} />

          {/* Cards */}
          <div className="space-y-4">
            {result.cards.map((card: any) => (
              <div
                key={card.assetId}
                ref={(el) => { cardRefs.current[card.assetId] = el }}
                id={`card-${card.assetId}`}
              >
                {card.error ? (
                  <ErrorCard
                    assetId={card.assetId}
                    portalUrl={card.portal?.url ?? ''}
                    portalName={card.portal?.name ?? 'Official Portal'}
                  />
                ) : (
                  <AssetCard
                    card={card}
                    isChecked={!!checkedItems[card.assetId]}
                    onToggle={() => toggleItem(card.assetId)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Generated timestamp */}
          <p className="text-xs text-[#6B7280] mt-8">
            Generated {new Date(result.generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>

          <Disclaimer />
        </main>
      </div>

      {/* Floating WhatsApp button */}
      <WhatsAppShare cards={validCards} />
    </div>
  )
}
