// Edit this list and then run `npm run seed:case-studies` to crawl + research +
// generate audits for each, mark them as featured, and surface them on the
// public /case-studies page.
//
// Tip: the model uses 'industry' as a hint, not an assertion. Leave it
// undefined if you're not sure — the crawl + research will fill the gap.

export interface CaseStudySeed {
  businessName: string;
  websiteUrl: string;
  founders?: string[];
  industry?: string;
}

export const CASE_STUDIES: CaseStudySeed[] = [
  { businessName: "Guardz",         websiteUrl: "https://guardz.com/" },
  { businessName: "Polar Bear Gifts", websiteUrl: "https://polarbeargifts.net/" },
  { businessName: "Vybe Wear",      websiteUrl: "https://vybewear.com/" },
  { businessName: "Al Wadhi",       websiteUrl: "https://alwadhi.com/" }
];
