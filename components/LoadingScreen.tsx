'use client'

import { useLoadingMessages } from '@/hooks/useLoadingMessages'

interface Props {
  isLoading: boolean
}

export default function LoadingScreen({ isLoading }: Props) {
  const message = useLoadingMessages(isLoading)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAF8]">
      <div className="w-full max-w-sm px-6 text-center">
        {/* Logo */}
        <div className="mb-10">
          <span className="text-xl font-medium text-[#1A1A1A] tracking-tight">GriefCart</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-[#E8E8E8] rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#2D6A4F] rounded-full animate-loading-bar" />
        </div>

        {/* Status message */}
        <p className="text-sm text-[#6B7280] min-h-[20px] transition-opacity duration-300">
          {message}
        </p>

        {/* Time note */}
        <p className="text-xs text-[#6B7280] mt-4 opacity-60">
          This usually takes 15–25 seconds
        </p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          40% { width: 60%; margin-left: 0; }
          60% { width: 20%; margin-left: 60%; }
          80% { width: 40%; margin-left: 40%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2.4s ease-in-out infinite;
          width: 40%;
        }
      `}</style>
    </div>
  )
}
