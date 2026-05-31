export type SupportedLanguage = 'english' | 'hindi' | 'malayalam' | 'tamil' | 'telugu' | 'kannada' | 'bengali' | 'marathi'

export interface UserInput {
  state: string
  assets: string[]
  hasWill: 'yes' | 'no' | 'unsure'
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other'
  concerns: string
  dateOfDeath?: string   // ISO date string e.g. "2024-05-15"
  language?: SupportedLanguage
}

export interface ChecklistBranch {
  steps: string[]
  documents: string[]
  timeline: string
}

export interface ChecklistCard {
  assetId: string
  title: string
  priority: number
  withNominee: ChecklistBranch
  withoutNominee: ChecklistBranch
  deadline: string | null
  portal: { name: string; url: string }
  commonMistakes: string[]
  scrapeStatus: 'ok' | 'failed' | 'partial'
  scrapedUrls: string[]
  error?: boolean
}

export interface ChecklistResponse {
  cards: ChecklistCard[]
  masterTimeline: string[]
  disclaimer: string
  generatedAt: string
}

export interface ScrapeResult {
  url: string
  content: string
  status: 'ok' | 'failed' | 'partial'
}

export interface AssetScrapeMap {
  assetId: string
  urls: string[]
}

export interface AssetDefinition {
  id: string
  label: string
  icon: string
  priority: number
  category: 'financial' | 'property' | 'identity' | 'business'
}

export interface StateDefinition {
  id: string
  label: string
  propertyPortalUrl: string
  propertyPortalName: string
}

export interface FallbackEntry {
  assetId: string
  summary: string
  officialUrl: string
  portalName: string
}
