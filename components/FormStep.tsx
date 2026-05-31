'use client'

import { useState } from 'react'
import { statesConfig } from '@/config/states.config'
import { assetsConfig } from '@/config/assets.config'
import type { UserInput } from '@/lib/types'
import {
  Landmark, Building2, Shield, Briefcase, PiggyBank,
  Banknote, TrendingUp, Home, Car, Users, Calendar,
  Store, IdCard,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  landmark: <Landmark size={20} />, 'building-2': <Building2 size={20} />,
  shield: <Shield size={20} />, briefcase: <Briefcase size={20} />,
  'piggy-bank': <PiggyBank size={20} />, banknote: <Banknote size={20} />,
  'trending-up': <TrendingUp size={20} />, home: <Home size={20} />,
  car: <Car size={20} />, users: <Users size={20} />,
  calendar: <Calendar size={20} />, store: <Store size={20} />,
  'id-card': <IdCard size={20} />,
}

interface Props {
  onSubmit: (data: UserInput) => void
  isLoading: boolean
}

const emptyInput: UserInput = {
  state: '', assets: [], hasWill: '' as never, relationship: '' as never, concerns: '',
}

export default function FormStep({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<UserInput>(emptyInput)
  const [errors, setErrors] = useState<Partial<Record<keyof UserInput | 'assets', string>>>({})

  const toggleAsset = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assets: prev.assets.includes(id) ? prev.assets.filter((a) => a !== id) : [...prev.assets, id],
    }))
    setErrors((e) => ({ ...e, assets: undefined }))
  }

  const validate = (): boolean => {
    const errs: typeof errors = {}
    if (!form.state) errs.state = 'Please select a state.'
    if (form.assets.length === 0) errs.assets = 'Please select at least one asset.'
    if (!form.hasWill) errs.hasWill = 'Please select an option.'
    if (!form.relationship) errs.relationship = 'Please select your relationship.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* State */}
      <div>
        <label htmlFor="state-select" className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Which state did they live in?
        </label>
        <select
          id="state-select"
          value={form.state}
          onChange={(e) => { setForm((p) => ({ ...p, state: e.target.value })); setErrors((er) => ({ ...er, state: undefined })) }}
          className="w-full max-w-sm border border-[#E8E8E8] rounded-md px-3 py-2.5 text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent appearance-none"
        >
          <option value="">Select state or UT</option>
          {statesConfig.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        {errors.state && <p className="text-xs text-[#E76F51] mt-1">{errors.state}</p>}
      </div>

      {/* Assets */}
      <div>
        <p className="text-sm font-medium text-[#1A1A1A] mb-1">
          What did they have? <span className="text-[#6B7280] font-normal">(select all that apply)</span>
        </p>
        <p className="text-xs text-[#6B7280] mb-4">Each item will generate its own step-by-step checklist.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {assetsConfig.map((asset) => {
            const selected = form.assets.includes(asset.id)
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => toggleAsset(asset.id)}
                className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all duration-150 min-h-[88px] ${
                  selected
                    ? 'border-[#2D6A4F] bg-[#F0F7F4]'
                    : 'border-[#E8E8E8] bg-white hover:border-[#2D6A4F]/40 hover:bg-[#FAFAF8]'
                }`}
                aria-pressed={selected}
              >
                <span className={selected ? 'text-[#2D6A4F]' : 'text-[#6B7280]'}>
                  {iconMap[asset.icon]}
                </span>
                <span className={`text-xs leading-snug ${selected ? 'text-[#1A1A1A] font-medium' : 'text-[#6B7280]'}`}>
                  {asset.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.assets && <p className="text-xs text-[#E76F51] mt-2">{errors.assets}</p>}
      </div>

      {/* Will status */}
      <div>
        <p className="text-sm font-medium text-[#1A1A1A] mb-3">Is there a Will?</p>
        <div className="flex flex-wrap gap-3">
          {(['yes', 'no', 'unsure'] as const).map((v) => (
            <label
              key={v}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border cursor-pointer transition-all duration-150 min-h-[44px] ${
                form.hasWill === v
                  ? 'border-[#2D6A4F] bg-[#F0F7F4] text-[#1A1A1A]'
                  : 'border-[#E8E8E8] bg-white text-[#6B7280] hover:border-[#2D6A4F]/40'
              }`}
            >
              <input
                type="radio"
                name="hasWill"
                value={v}
                checked={form.hasWill === v}
                onChange={() => { setForm((p) => ({ ...p, hasWill: v })); setErrors((er) => ({ ...er, hasWill: undefined })) }}
                className="sr-only"
              />
              <span className="text-sm capitalize">{v === 'unsure' ? 'Not Sure' : v.charAt(0).toUpperCase() + v.slice(1)}</span>
            </label>
          ))}
        </div>
        {errors.hasWill && <p className="text-xs text-[#E76F51] mt-1">{errors.hasWill}</p>}
      </div>

      {/* Relationship */}
      <div>
        <p className="text-sm font-medium text-[#1A1A1A] mb-3">You are their…</p>
        <div className="flex flex-wrap gap-3">
          {(['spouse', 'child', 'parent', 'sibling', 'other'] as const).map((v) => (
            <label
              key={v}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md border cursor-pointer transition-all duration-150 min-h-[44px] ${
                form.relationship === v
                  ? 'border-[#2D6A4F] bg-[#F0F7F4] text-[#1A1A1A]'
                  : 'border-[#E8E8E8] bg-white text-[#6B7280] hover:border-[#2D6A4F]/40'
              }`}
            >
              <input
                type="radio"
                name="relationship"
                value={v}
                checked={form.relationship === v}
                onChange={() => { setForm((p) => ({ ...p, relationship: v })); setErrors((er) => ({ ...er, relationship: undefined })) }}
                className="sr-only"
              />
              <span className="text-sm capitalize">{v}</span>
            </label>
          ))}
        </div>
        {errors.relationship && <p className="text-xs text-[#E76F51] mt-1">{errors.relationship}</p>}
      </div>

      {/* Concerns */}
      <div>
        <label htmlFor="concerns" className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Anything specific you're worried about?{' '}
          <span className="text-[#6B7280] font-normal">(optional)</span>
        </label>
        <textarea
          id="concerns"
          rows={3}
          maxLength={200}
          placeholder="e.g. account is frozen, can't find the policy number"
          value={form.concerns}
          onChange={(e) => setForm((p) => ({ ...p, concerns: e.target.value }))}
          className="w-full max-w-lg border border-[#E8E8E8] rounded-md px-3 py-2.5 text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent resize-none"
        />
        <p className="text-xs text-[#6B7280] mt-1 text-right max-w-lg">
          {200 - form.concerns.length} characters remaining
        </p>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#2D6A4F] text-white text-sm font-medium px-8 py-3 rounded-md hover:bg-[#245c42] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
        >
          {isLoading ? 'Generating checklist…' : 'Generate my checklist →'}
        </button>
      </div>
    </form>
  )
}
