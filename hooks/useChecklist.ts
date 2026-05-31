'use client'

import { useState, useCallback } from 'react'
import type { ChecklistCard } from '@/lib/types'

export const useChecklist = (initialCards: ChecklistCard[]) => {
  const [cards] = useState<ChecklistCard[]>(initialCards)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [activeCard, setActiveCardState] = useState<string | null>(null)

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

  return { cards, checkedItems, activeCard, toggleItem, setActiveCard, getCompletedCount, getPriorityCards }
}
