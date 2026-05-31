export default function PrintStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
@media print {
  nav, .sidebar, button, .sticky-progress,
  .whatsapp-btn, footer { display: none !important; }

  .asset-card { page-break-inside: avoid; margin-bottom: 24pt; }
  .asset-card + .asset-card { page-break-before: always; }

  .collapsed-section { display: block !important; }

  body { font-size: 11pt; line-height: 1.6; color: #000; }
  a { color: #000; text-decoration: underline; }

  .disclaimer { border-top: 1pt solid #ccc; padding-top: 12pt;
    font-size: 9pt; color: #555; }

  @page {
    margin: 2cm;
  }
}
`,
      }}
    />
  )
}
