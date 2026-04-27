import type { AuditReport } from "./types";
import { getDomain } from "./utils";

// Fallback report used when OPENAI_API_KEY is not set, or when the model call
// fails, so the rest of the pipeline (DB write, email, PDF) keeps working.

export function buildMockReport(input: {
  businessName: string;
  websiteUrl: string;
  founders?: string[];
  industry?: string;
}): AuditReport {
  const domain = getDomain(input.websiteUrl);
  const industry = input.industry || "professional services";

  return {
    generated_at: new Date().toISOString(),
    business_name: input.businessName,
    website_url: input.websiteUrl,

    company_summary:
      `Based on a public-only review of ${domain}, ${input.businessName} appears to operate in the ${industry} space. ` +
      `This summary is generated in offline/mock mode because no AI provider key was configured at audit time, so specific facts have been kept generic and unverified.`,

    founder_research:
      input.founders?.length
        ? `Founders provided by submitter: ${input.founders.join(", ")}. No additional public research was performed in mock mode.`
        : "No founder names were provided and no public research was performed in mock mode.",

    mission_positioning:
      `${input.businessName}'s public site appears to position around delivering value to ${industry} customers. Specific mission language could not be verified in mock mode.`,

    website_observations: [
      "Homepage hero present, but value proposition could be sharpened in 1 sentence.",
      "Primary CTA appears, but not repeated above-the-fold on key pages.",
      "Pricing or 'how it works' section either missing or buried below the fold.",
      "No visible AI / automation product surface area today.",
      "Contact path exists but lacks instant-response (chat / scheduler) options."
    ],

    current_tech_stack: [
      "Marketing site (CMS undetermined in mock mode)",
      "Standard analytics likely",
      "No automation tooling detected"
    ],

    likely_business_model: `Service-led ${industry} with project or retainer pricing (assumed; not verified).`,

    AI_readiness_score: 42,
    AI_readiness_explanation:
      "Foundation in place but no AI surface area. Quick wins available in lead handling, content, and back-office workflows.",

    top_automation_opportunities: [
      {
        title: "AI lead-qualifier on the website",
        description:
          "Replace the static contact form with an AI assistant that asks 4-6 qualifying questions, scores intent, and books a call.",
        effort: "low",
        impact: "high",
        estimated_value: "$1.5k–$6k / month in recovered pipeline",
        tools: ["Vapi or ElevenLabs voice", "OpenAI", "Calendly"]
      },
      {
        title: "Inbox triage + draft replies",
        description:
          "Daily AI digest that summarises the inbox, flags high-priority threads, and drafts on-brand replies for one-click send.",
        effort: "low",
        impact: "medium",
        estimated_value: "5–8 hrs / week saved",
        tools: ["Gmail / Outlook API", "OpenAI", "Make.com"]
      },
      {
        title: "Proposal & SOW generator",
        description:
          "Internal app that turns a discovery-call transcript into a branded proposal in under 2 minutes.",
        effort: "medium",
        impact: "high",
        estimated_value: "Cuts proposal time by 80%",
        tools: ["OpenAI", "Notion / Google Docs API"]
      },
      {
        title: "Content engine for SEO + LinkedIn",
        description:
          "Repeatable AI workflow that turns one expert interview into 1 article, 5 LinkedIn posts, and 10 short-form clips.",
        effort: "medium",
        impact: "high",
        estimated_value: "10x content output at fixed cost",
        tools: ["Claude / GPT-4o", "Descript", "Buffer"]
      },
      {
        title: "Onboarding & FAQ assistant",
        description:
          "Knowledge-base-grounded assistant for new clients that answers 60-70% of repetitive questions automatically.",
        effort: "medium",
        impact: "medium",
        estimated_value: "Cuts onboarding support by ~40%",
        tools: ["Vector DB", "OpenAI", "Slack / Intercom"]
      }
    ],

    quick_wins: [
      {
        title: "Sharpen homepage hero in 1 hour",
        description:
          "Rewrite hero to follow the 'who-it's-for / problem / outcome' formula. Higher conversion, no engineering needed.",
        effort: "low",
        impact: "medium"
      },
      {
        title: "Add a scheduler to every CTA",
        description:
          "Replace 'contact us' email with an embedded Calendly/Cal.com link to compress lead-to-call time.",
        effort: "low",
        impact: "medium"
      },
      {
        title: "Auto-summary of every sales call",
        description:
          "Plug Fathom or Fireflies into your meeting tool — 0 effort, immediate CRM hygiene boost.",
        effort: "low",
        impact: "low"
      }
    ],

    implementation_roadmap: [
      {
        week: "Week 1",
        goal: "Quick-wins live",
        steps: [
          "Rewrite hero + primary CTA",
          "Embed scheduler on contact page",
          "Turn on AI meeting summaries"
        ]
      },
      {
        week: "Week 2",
        goal: "Inbox + lead triage",
        steps: [
          "Connect inbox to AI triage",
          "Ship lead-qualifier widget on homepage",
          "Pipe leads into CRM with score + summary"
        ]
      },
      {
        week: "Week 3",
        goal: "Proposal automation",
        steps: [
          "Template the SOW",
          "Wire transcript → proposal pipeline",
          "Internal launch with sales team"
        ]
      },
      {
        week: "Week 4",
        goal: "Content engine v1",
        steps: [
          "Record one founder interview",
          "Run the multi-format pipeline",
          "Publish + measure"
        ]
      }
    ],

    estimated_value: {
      range_low_usd: 24000,
      range_high_usd: 96000,
      rationale:
        "Annualised range from quick-wins + automation + proposal + content. Lower bound assumes only 2 of 5 opportunities are implemented; upper bound assumes the full 30-day plan ships."
    },

    recommended_offer:
      "30-day AI Implementation Sprint: we ship the 3 highest-ROI items end-to-end, fixed price, with a measurable success metric per item.",

    outbound_email_copy:
      `Subject: A quick AI audit we ran on ${input.businessName}\n\n` +
      `Hi ${input.founders?.[0] || "there"},\n\n` +
      `We took a public-only look at ${domain} and put together a short audit on where AI could realistically save you time or pull in more revenue in the next 30 days. ` +
      `A few of the bigger ones: an AI lead-qualifier on your site, inbox triage with auto-drafts, and a proposal generator that turns discovery calls into a branded SOW in under 2 minutes.\n\n` +
      `If it's useful, I'm happy to walk you through the report and the 3 we'd ship first — no pitch, just the audit.\n\n` +
      `— DubaiAI`,

    unknowns: [
      "Internal tooling and headcount were not verifiable from public sources",
      "Revenue, ARR, or funding numbers were not confirmed",
      "Existing AI initiatives (if any) were not detected in the public site"
    ],

    citations: [
      { label: `${domain} (homepage)`, url: input.websiteUrl }
    ]
  };
}
