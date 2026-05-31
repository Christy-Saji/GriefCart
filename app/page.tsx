import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-5">
        <span className="text-base font-medium text-[#1A1A1A] tracking-tight">GriefCart</span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-medium text-[#1A1A1A] leading-tight mb-4 tracking-tight">
            Someone passed away.
          </h1>
          <p className="text-2xl sm:text-3xl font-medium text-[#6B7280] mb-8 leading-tight">
            Here's what needs to happen.
          </p>
          <p className="text-base text-[#6B7280] leading-relaxed mb-2 max-w-md mx-auto">
            Tell us what they owned. We'll give you a plain-English checklist of exactly what to
            do — scraped from official sources.
          </p>
          <p className="text-sm text-[#6B7280] mb-12 opacity-75">
            Covers bank accounts, LIC, EPF, property, vehicle, pension, and more across all Indian states.
          </p>
          <Link
            href="/form"
            id="get-started-btn"
            className="inline-block bg-[#2D6A4F] text-white text-sm font-medium px-8 py-3.5 rounded-md hover:bg-[#245c42] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
          >
            Get started →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 text-center">
        <p className="text-xs text-[#6B7280]">
          No sign-up required. Free to use. Data never stored.
        </p>
      </footer>
    </div>
  )
}
