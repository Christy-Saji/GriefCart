'use client'

import { useState, useEffect } from 'react'

const messages = [
  'Checking SBI nominee claim process...',
  'Reading LIC death claim procedure...',
  'Looking up EPF withdrawal rules...',
  'Checking property mutation process...',
  'Reading pension transfer guidelines...',
  'Looking up SEBI transmission rules...',
  'Checking vehicle RC transfer process...',
  'Reading NPS withdrawal procedure...',
  'Putting your checklist together...',
]

export const useLoadingMessages = (isLoading: boolean): string => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    setIndex(0)
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [isLoading])

  return messages[index]
}
