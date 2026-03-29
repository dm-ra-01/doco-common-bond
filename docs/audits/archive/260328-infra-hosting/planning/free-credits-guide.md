# Free Credits & Startup Programs Guide

This guide outlines the available free credits and startup programs for both Google Cloud and Supabase to minimize the operational cost of the Receptor ecosystem.

## 1. Google Cloud Platform (GCP)

### 1.1 New Customer Welcome Credit
- **Amount:** **$300 USD**
- **Duration:** 90 Days
- **Eligibility:** Any new Google Cloud account with a valid billing method.
- **Usage:** Can be used for all Cloud Run, Secret Manager, and Artifact Registry costs.

### 1.2 Google for Startups Cloud Program
> [!TIP]
> This is the most significant opportunity for Receptor. Given the agentic AI focus, the "AI-First" tracks are highly relevant.

| Tier | Credit Amount | Duration | Eligibility |
| :--- | :--- | :--- | :--- |
| **Start** | **$2,000 USD** | 12 Months | Early-stage, non-funded startups. |
| **Scale** | **$100,000 USD** | 12 Months | Equity-funded (Seed to Series A). |
| **AI-First** | **Up to $350,000** | 24 Months | AI-focused startups with funding. |

- **How to Apply:** [cloud.google.com/startup](https://cloud.google.com/startup)

---

## 2. Supabase

### 2.1 Always Free Tier
- **Database:** 500MB storage
- **Auth:** 50,000 Monthly Active Users (MAU)
- **Storage:** 1GB file storage
- **Edge Functions:** 25% of Pro tier limits.
- **Constraint:** Projects pause after 7 days of inactivity (can be resumed manually).

### 2.2 Supabase for Startups
Supabase offers a partnership program for startups in accelerators (Y Combinator, Techstars, etc.) or early-stage VC portfolios.
- **Amount:** Typically **$1,000 USD** in credits or **1 Year of Pro Tier**.
- **How to Apply:** [supabase.com/for-startups](https://supabase.com/for-startups)

---

## 3. Supplementary Credits

### 3.1 GitHub Global Campus (Student/Educator)
If you have an `.edu` email or academic affiliation:
- **GCP:** Additional $100 - $200 in credits.
- **Supabase:** No direct credits, but provides other SaaS tools (Stripe, etc.) that indirectly save costs.

### 3.2 Cloudflare Free Tier
- **DNS/WAF:** Always free for the first domain.
- **Workers:** 100k requests/day (Free).

---

## Summary Action Plan
1. **Activate the $300 GCP Credit:** Do this on the "Production" project first.
2. **Apply for 'Start' Tier GCP Credits:** Once the migration implementation begins, apply with the `commonbond.au` domain to secure the $2,000/year allocation.
3. **Stay on Supabase Free Tier:** For `workforce-frontend` and `preference-frontend` staging environments, the free tier is sufficient. Only move `receptor-main` to Pro once traffic justifies the $25/month cost.
