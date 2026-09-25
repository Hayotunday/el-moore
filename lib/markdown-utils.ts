import type { BlogPost } from "./api/types";

/**
 * Strips Markdown syntax and HTML tags to yield clean plain text.
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return "";
  return (
    markdown
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove images
      .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
      // Remove links keep link text
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      // Remove headings
      .replace(/#{1,6}\s+/g, "")
      // Remove bold and italics
      .replace(/(\*\*|__|\*|_)(.*?)\1/g, "$2")
      // Remove blockquotes
      .replace(/^\s*>\s+/gm, "")
      // Remove list markers
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Replace multiple newlines/spaces with single space
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Creates a clean plain-text excerpt of specified length from Markdown content.
 */
export function getMarkdownExcerpt(markdown: string, maxLength: number = 160): string {
  const plainText = stripMarkdown(markdown);
  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}…` : `${truncated}…`;
}

/**
 * Estimates reading time in minutes based on word count (~200 words per minute).
 */
export function estimateReadingTime(markdown: string): number {
  const plainText = stripMarkdown(markdown);
  if (!plainText) return 1;
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * High-quality fallback blog posts written in markdown for El-Moore Real Estate.
 */
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: "sample-1",
    title: "Understanding Certificate of Occupancy & Land Titles in Nigeria",
    slug: "understanding-certificate-of-occupancy-land-titles-nigeria",
    coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    published: true,
    publishedAt: "2026-03-15T10:00:00.000Z",
    createdAt: "2026-03-15T10:00:00.000Z",
    content: `# Understanding Certificate of Occupancy & Land Titles in Nigeria

Investing in Nigerian real estate offers extraordinary yields, but securing title authenticity is the paramount foundation of any wealth creation strategy.

## What is a Certificate of Occupancy (C of O)?

A **Certificate of Occupancy (C of O)** is an official legal document issued by the state government confirming that the holder has been granted statutory right of occupancy for a designated piece of land for a 99-year term.

> "A property without a verified title is not an investment; it is an unhedged speculative risk." — *El-Moore Legal Advisory*

---

### Key Legal Documents to Verify Before Buying

When conducting due diligence on land or developed property in Lagos and prime Nigerian corridors, verify the following title instruments:

1. **Gazette / Excision Status**: Confirms the government has released the land parcel from acquisition to the indigenous village or developer.
2. **Deed of Assignment**: Transfers property ownership rights from the seller to the buyer.
3. **Governor's Consent**: Required for subsequent sales of land that already has a C of O. Without Governor's Consent, subsequent transfers are legally incomplete.
4. **Survey Plan**: Delineates the exact geographic boundary coordinates plotted with the Surveyor General's office.

---

### Step-by-Step Title Verification Checklist

| Verification Step | Target Office | Purpose |
| :--- | :--- | :--- |
| **Land Registry Search** | State Lands Bureau | Confirms registered title owner and checks for existing mortgages or legal encumbrances. |
| **Chartings & Coordinates** | Office of the Surveyor General | Verifies land does not fall within committed government acquisition or pipeline rights of way. |
| **Physical Inspection** | Property Location | Verifies physical dimensions, access roads, and absence of active boundary disputes. |

---

### How El-Moore Protects Investors

Every listing presented in our private showroom undergoes a **multi-tiered legal audit**:
- Complete title verification with the State Lands Bureau
- On-site spatial boundary plotting
- Escrow-backed contract structures for maximum asset protection

Whether you are building a commercial portfolio or acquiring residential acreage, ensuring pristine documentation guarantees your generational wealth.`,
  },
  {
    id: "sample-2",
    title: "Evaluating ROI: Buy-to-Let vs. Buy-to-Sell Commercial Land",
    slug: "evaluating-roi-buy-to-let-vs-buy-to-sell-commercial-land",
    coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    published: true,
    publishedAt: "2026-03-10T14:30:00.000Z",
    createdAt: "2026-03-10T14:30:00.000Z",
    content: `# Evaluating ROI: Buy-to-Let vs. Buy-to-Sell Commercial Land

High-net-worth real estate investors in emerging African financial hubs face a pivotal choice: **Capital Appreciation** through resale or **Sustained Yield** through leasing.

## Comparison Matrix

- **Buy-to-Sell Strategy**: Acquiring undervalued land in high-growth corridors (e.g., Epe-Ibeju Lekki, Guzape extension) and exiting at key infrastructure milestones. Average projected ROI: **25% – 40% per annum**.
- **Buy-to-Let Strategy**: Developing specialized commercial assets or leasing land to logistics, warehousing, or hospitality tenants. Average projected cashflow yield: **12% – 18% annual rental return** with ongoing capital retention.

### Strategic Considerations

> "The true measure of real estate wealth lies not just in paper valuation, but in net risk-adjusted liquidity when market cycles pivot."

#### Key Advantages of Land Banking:
* Zero ongoing building maintenance overheads
* High immunity to short-term rental market vacancies
* Exceptional leverage during infrastructure developments (ports, airports, free trade zones)

### Final Verdict

For aggressive growth portfolios, allocate **60% to Buy-to-Sell land banking** and **40% to income-generating rental properties**. Reach out to your El-Moore wealth advisor for custom ROI models tailored to your cash flow target.`,
  },
  {
    id: "sample-3",
    title: "Governor's Consent Explained: Avoiding Costly Conveyancing Pitfalls",
    slug: "governors-consent-explained-avoiding-costly-conveyancing-pitfalls",
    coverImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    published: true,
    publishedAt: "2026-02-28T09:15:00.000Z",
    createdAt: "2026-02-28T09:15:00.000Z",
    content: `# Governor's Consent Explained: Avoiding Costly Conveyancing Pitfalls

Under Section 22 of the Land Use Act of 1978, it is unlawful for any holder of a statutory right of occupancy to alienate, assign, or mortgage their property without first seeking and obtaining the consent of the State Governor.

## Why Governor's Consent Matters

Many buyers believe that having a signed Deed of Assignment and a copy of the seller's Certificate of Occupancy completes their purchase. **This is a dangerous misconception.**

\`\`\`text
Purchase Agreement -> Execution of Deed -> Application for Governor's Consent -> Assessment & Perfection -> Stamped & Registered Title
\`\`\`

### Essential Steps for Perfecting Title

1. Obtain official land search report confirming title validity.
2. Draft and execute formal Deeds of Assignment with revenue stamps.
3. Submit formal application to the Ministry of Lands with charting records.
4. Pay assessed stamp duties, registration fees, and consent fees.
5. Receive endorsement from the Honorable Attorney General or Commissioner for Lands.

By completing Governor's Consent, your ownership becomes indefeasible and legally enforceable against any third-party claims.`,
  },
];
