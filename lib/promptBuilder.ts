import { assetsConfig } from '@/config/assets.config'
import type { UserInput, SupportedLanguage } from '@/lib/types'

export interface AssetContent {
  assetId: string
  content: string
}

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  english: 'English',
  hindi: 'Hindi (हिंदी)',
  malayalam: 'Malayalam (മലയാളം)',
  tamil: 'Tamil (தமிழ்)',
  telugu: 'Telugu (తెలుగు)',
  kannada: 'Kannada (ಕನ್ನಡ)',
  bengali: 'Bengali (বাংলা)',
  marathi: 'Marathi (मराठी)',
}

/**
 * Builds a single batched prompt for ALL assets at once.
 * Returns a prompt that instructs Groq to produce a JSON array of cards.
 */
export const buildBatchPrompt = (
  assets: AssetContent[],
  userInput: UserInput
): string => {
  const { state, relationship, hasWill, concerns, dateOfDeath, language = 'english' } = userInput

  const languageLabel = LANGUAGE_LABELS[language] ?? 'English'

  // Build deadline context if date of death is provided
  const dateContext = dateOfDeath
    ? `Date of death: ${new Date(dateOfDeath).toLocaleDateString('en-IN', { dateStyle: 'long' })} — use this to compute actual deadline dates where relevant (e.g. "by 14 August 2024" instead of "within 90 days").`
    : 'Date of death not provided — use relative deadline language (e.g. "within 90 days of death").'

  const assetSections = assets
    .map(({ assetId, content }) => {
      const label = assetsConfig.find((a) => a.id === assetId)?.label ?? assetId
      return `### ASSET: ${assetId} — ${label}\n${content.slice(0, 1500)}`
    })
    .join('\n\n---\n\n')

  return `You are a compassionate legal and financial guide helping an Indian family navigate administrative tasks after a death. You have scraped content from official government and institutional websites for multiple assets.

CONTEXT:
- Deceased lived in: ${state}
- Relationship of person filling this: ${relationship}
- Is there a Will: ${hasWill}
- Additional concern: ${concerns || 'none'}
- ${dateContext}
- Output language: ${languageLabel} — write ALL text values (titles, steps, documents, deadlines, mistakes) in ${languageLabel}. Keep JSON keys in English.

SCRAPED CONTENT PER ASSET:
---
${assetSections}
---

Generate a JSON ARRAY where each element is a card for one asset. The array must have exactly ${assets.length} elements, one per asset listed above, in the same order.

Each element must follow this exact schema:
{
  "assetId": "<the assetId string exactly as given>",
  "title": "Plain-language title for this task (max 8 words)",
  "priority": <integer 1-5, 1 = do within 7 days>,
  "withNominee": {
    "steps": ["Step 1", "Step 2", "..."],
    "documents": ["Document 1", "Document 2", "..."],
    "timeline": "e.g. 2-4 weeks"
  },
  "withoutNominee": {
    "steps": ["Step 1", "Step 2", "..."],
    "documents": ["Document 1", "Document 2", "..."],
    "timeline": "e.g. 3-6 months"
  },
  "deadline": "<specific deadline string, or null if none>",
  "portal": {
    "name": "<institution name>",
    "url": "<official URL>"
  },
  "commonMistakes": [
    "Mistake 1",
    "Mistake 2",
    "Mistake 3"
  ]
}

CRITICAL RULES:
- Respond with ONLY a JSON array
- Start your response with [ and end with ]
- Do not include any text, explanation, or markdown before or after
- Do not wrap in code fences
- Every string value must use double quotes
- All arrays must have at least one item
- The array must have exactly ${assets.length} elements`
}
