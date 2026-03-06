---
title: Public Landing Page
sidebar_label: Landing Page
---

# Public Landing Page (website-frontend)

The **Public Landing Page** is the primary marketing and informational hub for
Common Bond and the Receptor platform.

## Core Purpose

- **Brand Presentation**: Establishing credibility in the medical workforce
  sector
- **Value Proposition**: Communicating Common Bond's "Doctor-Developer"
  positioning
- **Product Showcase**: High-level overview of the four core Receptor apps
  (Workforce, Planner, Preferencer, Allocator)
- **Lead Generation**: Clear CTAs for consultations and inquiries
- **Roadmap**: Showcasing future horizons (Roster and Shift management)

## Design Language

| Element        | Choice                                      | Rationale                        |
| :------------- | :------------------------------------------ | :------------------------------- |
| Typography     | **Outfit**                                  | Geometric, enterprise-grade feel |
| Primary colour | **Indigo #4f46e5**                          | Professional, modern             |
| Background     | **Deep Slate #0f172a**                      | Clinical authority               |
| Interactions   | Glassmorphism, gradients, smooth animations | Premium feel                     |

## Technical Stack

| Layer      | Technology                       |
| :--------- | :------------------------------- |
| Framework  | React 18+ (Vite)                 |
| Styling    | Tailwind CSS                     |
| Animations | Framer Motion                    |
| Icons      | Lucide React                     |
| Deployment | Static hosting (Cloudflare / S3) |

> [!NOTE]
> The Public Landing Page is the only Receptor application that uses Tailwind
> CSS. All management frontends (Planner, Workforce, Preferencer) use Vanilla
> CSS.

## Page Structure

- **Landing**: DNA story, product suite overview, roadmap
- **Product Suite**: Feature breakout for each core app
- **Case Studies**: Founder dual-expertise validation
- **Pricing**: Enterprise partnership and licensure model

## Repository Context

- **Repo**: [website-frontend](https://github.com/dm-ra-01/website-frontend)
- **Dev Port**: `http://localhost:5178`
