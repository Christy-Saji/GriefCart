'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormStep from '@/components/FormStep'
import LoadingScreen from '@/components/LoadingScreen'
import type { UserInput } from '@/lib/types'

export default function FormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (data: UserInput) => {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 429) {
        setErrorMsg('Already generating your checklist. Just a moment…')
        setIsLoading(false)
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(
          body.error ??
          'Something went wrong. Please try again — it usually works on the second attempt.'
        )
        setIsLoading(false)
        return
      }

      const result = await res.json()
      sessionStorage.setItem('griefcart_result', JSON.stringify(result))
      router.push('/results')
    } catch {
      setErrorMsg('Something went wrong. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingScreen isLoading={isLoading} />

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-5 border-b border-[#E8E8E8]">
        <a href="/" className="text-base font-medium text-[#1A1A1A] tracking-tight hover:opacity-70 transition-opacity">
          GriefCart
        </a>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-[#1A1A1A] mb-2">Tell us about their estate</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            This takes about 2 minutes. Your answers stay in your browser and are never stored on our servers.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-900">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs text-amber-700 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <FormStep onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  )
}
