import type { FallbackEntry } from '@/lib/types'

export const fallbackData: FallbackEntry[] = [
  {
    assetId: 'sbi_account',
    summary:
      'To claim a deceased person\'s SBI account, the nominee must visit the home branch with the original death certificate, nominee\'s ID proof, KYC documents, and a filled claim form (DA1 or DA2 depending on nominee status). If no nominee exists, the legal heir must obtain a Succession Certificate from civil court, which can take 3–6 months. SBI typically processes nominee claims within 15–30 working days. A letter of indemnity may be required for amounts over ₹1 lakh.',
    officialUrl: 'https://sbi.co.in/web/personal-banking/accounts/deceased-claim',
    portalName: 'State Bank of India',
  },
  {
    assetId: 'private_bank_account',
    summary:
      'Private banks follow RBI guidelines for deceased account settlement. The nominee must submit a claim form, original death certificate, nominee\'s Aadhaar and PAN, and a cancelled cheque. If no nominee exists, legal heirs must provide a Succession Certificate or Letters of Administration issued by a court. Processing time is typically 15–30 working days for nominee claims. Banks may require an indemnity bond for claims above ₹1 lakh without a nominee.',
    officialUrl: 'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=582',
    portalName: 'RBI — Deceased Account Guidelines',
  },
  {
    assetId: 'lic_policy',
    summary:
      'LIC death claims require the original policy document, death certificate, claimant\'s statement (Form 3783), NEFT mandate, and identity/address proof. Nominee claims are processed within 30 days of submission. Early death claims (within 3 years) undergo investigation and may take up to 6 months. Claims can be submitted at any LIC branch or online via the LIC portal.',
    officialUrl: 'https://licindia.in/claim-procedure',
    portalName: 'LIC India',
  },
  {
    assetId: 'epf_account',
    summary:
      'EPF death benefits include the PF accumulation, pension under EPS (Form 10D), and EDLI insurance (up to ₹7 lakh). Nominee must submit Form 20 (PF withdrawal), Form 10D (pension), and Form 5IF (insurance) to the employer or directly to the EPFO office. The process takes 30–90 days. Aadhaar and bank account must be linked to the UAN for seamless processing.',
    officialUrl: 'https://www.epfindia.gov.in/site_en/For_Employees.php',
    portalName: 'EPFO',
  },
  {
    assetId: 'ppf_account',
    summary:
      'PPF accounts cannot be continued after death. The nominee or legal heir must submit Form G (nomination claim) or Form H (legal heir claim) along with the death certificate, original passbook, and identity proof to the branch where the account is held. The balance is paid out without any tax deduction. The process typically takes 2–4 weeks after document submission.',
    officialUrl: 'https://www.indiapost.gov.in/Financial/pages/content/ppf.aspx',
    portalName: 'India Post — PPF',
  },
  {
    assetId: 'fixed_deposits',
    summary:
      'For Fixed Deposits, the nominee must visit the bank with the original FD receipt or certificate, death certificate, nominee\'s KYC documents, and a filled claim form. If the FD has not matured, the bank will allow premature closure without penalty in case of death. Proceeds are credited to the nominee\'s account. Without a nominee, legal heirs must produce a Succession Certificate and indemnity bond.',
    officialUrl: 'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=582',
    portalName: 'RBI — Bank Deposits Guidelines',
  },
  {
    assetId: 'mutual_funds_demat',
    summary:
      'For mutual funds and demat accounts, transmission of securities to the nominee requires submitting a Transmission Request Form to the AMC or depository participant, along with the death certificate, nominee\'s KYC, and notarised indemnity bond. SEBI guidelines require completion within 7 working days for physical securities and 15 days for demat. If no nominee, a Succession Certificate from the civil court is mandatory.',
    officialUrl: 'https://www.sebi.gov.in/legal/circulars/aug-2015/guidelines-for-transmission-of-securities-in-case-of-death-of-holder_30165.html',
    portalName: 'SEBI — Transmission of Securities',
  },
  {
    assetId: 'immovable_property',
    summary:
      'Transfer of immovable property after death involves mutation of the property record in the local municipal or revenue department. The legal heir or nominee must submit the death certificate, Will (if available) or Succession Certificate, original property documents, and a mutation application to the local Sub-Registrar or municipality. Stamp duty may apply. The process can take 1–6 months depending on the state and whether a Will exists.',
    officialUrl: 'https://igrs.gov.in',
    portalName: 'State Registration Portal',
  },
  {
    assetId: 'vehicle',
    summary:
      'Transfer of vehicle ownership after death requires submitting Form 31 (transfer of ownership on death) to the Regional Transport Office (RTO) along with the original RC book, insurance certificate, death certificate, succession/NOC from legal heirs, and valid PUC certificate. The process takes approximately 30–60 days at the RTO. Road tax dues, if any, must be cleared before transfer.',
    officialUrl: 'https://parivahan.gov.in/parivahan/en/content/transfer-ownership',
    portalName: 'Parivahan Sewa — MoRTH',
  },
  {
    assetId: 'government_pension',
    summary:
      'Family pension is granted to the spouse, children, or dependent parents of a deceased government employee or pensioner. The spouse must submit Form 14 (application for family pension) to the pension disbursing authority with the death certificate, PPO (Pension Payment Order), marriage certificate, and bank account details. The pension starts from the day after death. Unmarried daughters are eligible till marriage; sons up to age 25.',
    officialUrl: 'https://doppw.gov.in/en/family-pension',
    portalName: 'Department of Pension & Pensioners Welfare',
  },
  {
    assetId: 'nps_account',
    summary:
      'On death of an NPS subscriber, the nominee receives the entire accumulated corpus as a lump sum — no annuity purchase is required. The nominee must submit Form 303 (withdrawal form) to the nodal office or Point of Presence (PoP) with the death certificate, PRAN card, nominee\'s identity proof, and bank account details. Processing typically takes 30–60 days. Tax benefits apply on the withdrawal amount.',
    officialUrl: 'https://npscra.nsdl.co.in/nps-forms.php',
    portalName: 'NPS Trust / NSDL',
  },
  {
    assetId: 'gst_business',
    summary:
      'When a GST-registered proprietor or partner dies, the business registration must be either transferred or cancelled within 30 days of death to avoid penalties. The legal representative must file Form GST REG-16 for cancellation or apply for amendment if transferring the business. All pending returns must be filed and dues cleared. Failure to act within 30 days may result in cancellation by the GST department.',
    officialUrl: 'https://www.gst.gov.in/help/helpdesk',
    portalName: 'GST Portal',
  },
  {
    assetId: 'aadhaar_pan',
    summary:
      'After death, the Aadhaar and PAN of the deceased should be reported to prevent misuse. For Aadhaar, the family member can request deactivation by contacting UIDAI with the death certificate. For PAN, the legal representative must file the final income tax return of the deceased for the year of death and inform the Income Tax department. There is no mandatory cancellation, but filing the final return is a legal obligation.',
    officialUrl: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#deceased',
    portalName: 'Income Tax Portal / UIDAI',
  },
]

export const getFallback = (assetId: string): FallbackEntry => {
  return (
    fallbackData.find((f) => f.assetId === assetId) ?? {
      assetId,
      summary: 'Please visit the official portal for procedures related to this asset.',
      officialUrl: 'https://india.gov.in',
      portalName: 'India Gov Portal',
    }
  )
}
