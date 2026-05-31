'use client'

import { ExternalLink } from 'lucide-react'
import { assetsConfig } from '@/config/assets.config'

interface Props {
  assetId: string
  portalUrl: string
  portalName: string
}

export default function ErrorCard({ assetId, portalUrl, portalName }: Props) {
  const asset = assetsConfig.find((a) => a.id === assetId)
  const label = asset?.label ?? assetId

  return (
    <div className="asset-card bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch rounded-full bg-[#E8E8E8] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[#1A1A1A] mb-1">{label}</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
            We weren't able to generate steps for this automatically. Visit the official portal
            for the most accurate procedure.
          </p>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#2D6A4F] hover:underline"
          >
            {portalName}
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
