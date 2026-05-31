import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PrintStyles from '@/components/PrintStyles'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://griefcart.vercel.app'),
  title: 'GriefCart — Someone passed away. Here\'s what to do.',
  description:
    'Step-by-step guidance for Indian families navigating accounts, insurance, property, and legal tasks after a death.',
  openGraph: {
    title: 'GriefCart — Someone passed away. Here\'s what to do.',
    description:
      'Step-by-step guidance for Indian families navigating accounts, insurance, property, and legal tasks after a death.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GriefCart — Someone passed away. Here\'s what to do.',
    description: 'Plain-language checklists for Indian families after a death.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAF8] text-[#1A1A1A] antialiased`}>
        <PrintStyles />
        {children}
      </body>
    </html>
  )
}
