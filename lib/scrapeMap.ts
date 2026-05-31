import { getPropertyUrl } from '@/lib/stateMap'

export const getScrapeUrls = (assetId: string, stateId: string): string[] => {
  const map: Record<string, string[]> = {
    sbi_account: [
      'https://sbi.co.in/web/personal-banking/accounts/deceased-claim',
      'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=582',
    ],
    private_bank_account: [
      'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=582',
      'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/OtherDocuments/&fileName=deceased-account-settlement.pdf',
    ],
    lic_policy: [
      'https://licindia.in/claim-procedure',
      'https://licindia.in/death-claim',
    ],
    epf_account: [
      'https://www.epfindia.gov.in/site_en/For_Employees.php',
      'https://epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Form10D.pdf',
    ],
    ppf_account: [
      'https://www.indiapost.gov.in/Financial/pages/content/ppf.aspx',
    ],
    fixed_deposits: [
      'https://www.rbi.org.in/commonperson/English/Scripts/Notification.aspx?Id=582',
    ],
    mutual_funds_demat: [
      'https://www.sebi.gov.in/legal/circulars/aug-2015/guidelines-for-transmission-of-securities-in-case-of-death-of-holder_30165.html',
      'https://www.nsdl.co.in/faqs-transmission.php',
    ],
    immovable_property: [
      getPropertyUrl(stateId),
      'https://igrs.gov.in',
    ],
    vehicle: [
      'https://parivahan.gov.in/parivahan/en/content/transfer-ownership',
    ],
    government_pension: [
      'https://pensionersportal.gov.in/GConnect/closureprocedure.aspx',
      'https://doppw.gov.in/en/family-pension',
    ],
    nps_account: [
      'https://npscra.nsdl.co.in/nps-forms.php',
    ],
    gst_business: [
      'https://www.gst.gov.in/help/helpdesk',
    ],
    aadhaar_pan: [
      'https://uidai.gov.in/en/contact-support/have-any-question/292-english-uk/faqs/aadhaar-online-services/update-aadhaar-details/783-how-can-i-update-deactivate-aadhaar-in-case-of-death.html',
      'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1#deceased',
    ],
  }

  return map[assetId] ?? []
}
