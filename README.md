# GriefCart

> "Someone passed away. Here's exactly what you need to do."

GriefCart helps Indian families navigate the administrative, legal, and financial steps after a loved one's death. Enter what assets the deceased had — bank accounts, LIC, property, EPF — and get a plain-language, step-by-step checklist built from official sources.

## What it does
- Scrapes official government and institution process pages in real time
- Uses AI to synthesise plain-English steps, document lists, and timelines
- Branches by nominee status (with nominee vs without/legal heir route)
- Covers 13 asset types across all 36 Indian states and UTs
- Generates a printable PDF checklist

## Tech stack
- Next.js 14 (App Router)
- Anakin Scraper API — real-time scraping of official government pages
- Groq (Llama 3.3 70B) — AI synthesis of scraped content into structured checklists

## Running locally

```bash
git clone <your-repo-url>
cd griefcart
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local (see Environment Variables below)
npm run dev
# Visit http://localhost:3000
```

## Environment variables

| Variable | Where to get it | Description |
|----------|----------------|-------------|
| `ANAKIN_API_KEY` | [anakin.ai](https://anakin.ai) → API Keys | Scraper API for fetching official government pages |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys | Free LLM API — generates the step-by-step checklists |

Copy `.env.example` to `.env.local` and fill in both keys. The Groq free tier (30 RPM) is sufficient for local development and demo use.

## How it works

1. User selects assets and enters state/relationship details
2. App scrapes relevant official URLs in parallel (RBI, SEBI, LIC, Parivahan, etc.)
3. All scraped content is sent to Groq in a **single batched prompt**
4. Groq returns a structured JSON array — one card per asset
5. Results page renders cards with steps, documents, timelines, and deadlines

## Testing the scraper

```
GET http://localhost:3000/api/scrape-test
GET http://localhost:3000/api/scrape-test?url=https://licindia.in/claim-procedure
```

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add `ANAKIN_API_KEY` and `GROQ_API_KEY` in Vercel → Settings → Environment Variables
4. Deploy — `vercel.json` sets the API function timeout to 30s

## Built for

Anakin Build-A-Thon 2026
