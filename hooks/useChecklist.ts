'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ChecklistCard } from '@/lib/types'

const STORAGE_KEY = 'griefcart_progress'

export const useChecklist = (initialCards: ChecklistCard[]) => {
  const [cards] = useState<ChecklistCard[]>(initialCards)

  // Initialise from localStorage on mount
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const [activeCard, setActiveCardState] = useState<string | null>(null)

  // Persist to localStorage whenever checkedItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems))
    } catch {
      // ignore quota errors
    }
  }, [checkedItems])

  const toggleItem = useCallback((assetId: string) => {
    setCheckedItems((prev) => ({ ...prev, [assetId]: !prev[assetId] }))
  }, [])

  const setActiveCard = useCallback((assetId: string) => {
    setActiveCardState((prev) => (prev === assetId ? null : assetId))
  }, [])

  const getCompletedCount = useCallback(() => {
    return Object.values(checkedItems).filter(Boolean).length
  }, [checkedItems])

  const getPriorityCards = useCallback(
    (n: number): ChecklistCard[] => {
      return [...cards].sort((a, b) => a.priority - b.priority).slice(0, n)
    },
    [cards]
  )

  // Clear progress (e.g. when starting fresh)
  const clearProgress = useCallback(() => {
    setCheckedItems({})
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { cards, checkedItems, activeCard, toggleItem, setActiveCard, getCompletedCount, getPriorityCards, clearProgress }
}
