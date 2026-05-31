import type { ChecklistCard } from '@/lib/types'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

/**
 * Calls Groq (Llama 3.3 70B) once with a batched prompt and returns an array of ChecklistCards.
 * Groq free tier: 30 RPM — far more generous than Gemini's exhausted quota.
 * Retries with backoff on 429.
 */
export const callGeminiBatch = async (
  prompt: string,
  retries = 3
): Promise<ChecklistCard[]> => {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment')

  const body = {
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a compassionate legal and financial guide helping Indian families navigate administrative tasks after a death. Always respond with valid JSON only — no markdown, no explanation, no code fences.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
    max_tokens: 8192,
  }

  const backoffMs = [5000, 15000, 30000]

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`GROQ: attempt ${attempt + 1}/${retries + 1} using ${GROQ_MODEL}`)
    }

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (res.status === 429) {
      if (attempt < retries) {
        const delay = backoffMs[Math.min(attempt, backoffMs.length - 1)]
        console.log(`GROQ 429: rate limited. Waiting ${delay / 1000}s before retry...`)
        await new Promise((r) => setTimeout(r, delay))
        continue
      }
      throw new Error(`Groq HTTP 429 — rate limited after ${retries + 1} attempts`)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Groq HTTP ${res.status}: ${text.slice(0, 300)}`)
    }

    const data = await res.json()

    if (process.env.NODE_ENV === 'development') {
      console.log('GROQ response id:', data?.id)
      console.log('GROQ model used:', data?.model)
      console.log('GROQ usage:', JSON.stringify(data?.usage))
    }

    const rawText: string = data?.choices?.[0]?.message?.content ?? ''

    if (!rawText) {
      throw new Error('Empty Groq response')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('GROQ raw (first 600):', rawText.slice(0, 600))
    }

    // Extract JSON array robustly
    const startIdx = rawText.indexOf('[')
    const endIdx = rawText.lastIndexOf(']')
    if (startIdx === -1 || endIdx === -1) {
      console.error('GROQ: no JSON array in response. Raw:', rawText.slice(0, 400))
      throw new Error('No JSON array found in Groq response')
    }

    const jsonStr = rawText.slice(startIdx, endIdx + 1)
    const parsed = JSON.parse(jsonStr)

    if (!Array.isArray(parsed)) {
      throw new Error('Groq response was not a JSON array')
    }

    console.log(`GROQ: successfully parsed ${parsed.length} cards in 1 API call`)
    return parsed as ChecklistCard[]
  }

  throw new Error('Groq: exceeded retry limit')
}
