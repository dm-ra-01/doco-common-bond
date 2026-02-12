---
title: Service Catalog
sidebar_label: Service Catalog
sidebar_position: 0
---

# Service Catalog

Receptor delivers workforce intelligence through a structured suite of services. This catalog defines what Common Bond offers today and our roadmap for future capabilities.

---

## Service Tiers

| Tier | Description | Timeframe |
|------|-------------|-----------|
| **Core** | Production-ready services included in current contracts | Now |
| **Extension** | Planned capabilities building on the core platform | FY2027–28 |
| **Strategic** | Long-term vision services that extend beyond allocation | FY2028+ |

---

## Core Services (Available Now)

These services form the foundation of the Receptor platform and are delivered through four integrated pillars.

### Workforce
| Attribute | Value |
|-----------|-------|
| **Brand** | Workforce |
| **Persona** | Medical Workforce Manager |
| **Value Proposition** | Master data management for organizational structure—teams, locations, positions, and staff—ensuring consistent data across all allocation activities. |

**Capabilities:**
- Organization and location configuration
- Team hierarchy management (Categories → Teams → Positions)
- Staff directory with primary role assignments
- Position standardization for consistent allocation logic

---

### Planner
| Attribute | Value |
|-----------|-------|
| **Brand** | Planner |
| **Persona** | Medical Workforce Manager, Common Bond Consultant |
| **Value Proposition** | End-to-end management of allocation plans and runs, from job line configuration through to result publication. |

**Capabilities:**
- Allocation Plan lifecycle management
- Job Line creation and rotation configuration
- Run-specific position and worker mappings
- Rotation timeline builder with overlap prevention

---

### Preferencer
| Attribute | Value |
|-----------|-------|
| **Brand** | Preferencer |
| **Persona** | Junior Medical Officer (Intern, RMO, HMO, Registrar) |
| **Value Proposition** | Mobile-first interface for staff to discover job lines, express preferences, and view their final allocations—all within a transparent, auditable system. |

**Capabilities:**
- 5-level preference system (Love/Like/Neutral/Dislike/Never)
- Job line discovery with search and filtering
- Preferencing window countdown and status tracking
- Allocation result viewing
- Profile management

---

### Allocator
| Attribute | Value |
|-----------|-------|
| **Brand** | Allocator |
| **Persona** | Medical Workforce Manager |
| **Value Proposition** | The intelligence engine that resolves complex preferences against institutional constraints to produce optimal, fair, and transparent allocation results. |

**Capabilities:**
- Automated matching via [Allocation Algorithm](https://docs.commonbond.au/receptor/docs/platform/allocator-backend/algorithm)
- Constraint enforcement (Rotation overlap, Special requirements)
- Audit trail generation ("Why" a match was made)
- Results validation and manual override logging


---

## Extension Services (Near-Term: FY2027–28)

These services extend the core platform with enhanced intelligence, compliance, and rotation lifecycle capabilities.

### Rotation Operations

| Attribute | Value |
|-----------|-------|
| **Status** | Planned |
| **Persona** | Medical Workforce Manager, Junior Medical Officer |
| **Value Proposition** | Complete rotation lifecycle management—from allocation through term completion—enabling structured swap requests, term tracking, and automated documentation. |

**Planned Capabilities:**

#### Rotation Swaps
- Structured swap request workflow with approval gates
- Constraint validation (eligibility, overlap, training requirements)
- Audit trail for all swap transactions
- Notification system for affected parties

#### Certificates of Service
- Automated end-of-term documentation generation
- Supervisor sign-off workflow
- Integration with training portfolio systems
- Historical rotation record maintenance

---

### Constraint-Based Job Line Planning

| Attribute | Value |
|-----------|-------|
| **Status** | Planned |
| **Persona** | Medical Workforce Manager, Director of Clinical Training |
| **Value Proposition** | Rules engine that enforces compliance, wellbeing, and career planning constraints during allocation. |

**Planned Capabilities:**
- Maximum consecutive terms per specialty
- Protected training time enforcement
- Wellbeing constraints (e.g., no back-to-back night rotations)
- Career pathway recommendations

---

### AMC / PMCV Compliance Modules

| Attribute | Value |
|-----------|-------|
| **Status** | Planned |
| **Persona** | Director of Clinical Training |
| **Value Proposition** | Automated validation of job lines against AMC, PMCV, and College training requirements. |

**Planned Capabilities:**
- Entrustable Professional Activity (EPA) tracking
- Term type validation (e.g., must include General Medicine, ED, or Surgery)
- Accreditation status warnings
- Audit reports for College reviews

---

### Vocational Training Match Solutions

| Attribute | Value |
|-----------|-------|
| **Status** | Market Research Complete ([Analysis](/docs/strategy/research/vocational-training-analysis)) |
| **Persona** | College Training Coordinators, Health Service Training Administrators |
| **Value Proposition** | Extension of the matching engine to support Intern, PGY2, and Registrar cohorts beyond prevocational training. |

**Planned Capabilities:**
- RACP Basic Physician Training (BPT) allocation
- ACEM Emergency Medicine registrar matching
- RANZCP Psychiatry training allocations
- Multi-specialty, multi-site rotation coordination

---

### Position Documentation Repository

| Attribute | Value |
|-----------|-------|
| **Status** | Conceptual |
| **Persona** | Junior Medical Officer |
| **Value Proposition** | A knowledge base linked to each position and location, helping incoming staff understand the role before they start. |

**Planned Capabilities:**
- What the job is like (day-to-day description)
- Location information (parking, access, facilities)
- Escalation pathways (who to call for help)
- Team culture and expectations
- Peer reviews and tips

---

## Strategic Services (Far-Future: FY2028+)

These services represent Receptor's long-term vision to extend beyond allocation into adjacent workforce domains.

### Shift Listing Marketplace

| Attribute | Value |
|-----------|-------|
| **Status** | Prototype implemented in `rotator_worker/lib/listing/` |
| **Persona** | Medical Workforce Manager, Relief Staff |
| **Value Proposition** | A marketplace for unfilled shifts, enabling transparent bidding and assignment with rate visibility. |

**Prototype Capabilities (from existing codebase):**
- Listing status workflow (Draft → Pending Approval → Open → Assigned/Cancelled)
- Rate management (hourly, daily, total)
- Leave reason categorization (Annual Leave, Sick Leave, Additional Cover, etc.)
- Applicant tracking and assignment
- Calendar-based shift visualization

---

### Rostering Integration

| Attribute | Value |
|-----------|-------|
| **Status** | Prototype implemented in `rotator_worker/lib/rostering/` |
| **Persona** | Medical Workforce Manager, Rostering Coordinator |
| **Value Proposition** | Integration layer that feeds confirmed allocations into rostering systems, ensuring continuity from 3-month allocation to daily shift patterns. |

**Prototype Capabilities (from existing codebase):**
- Shift model with timezone-aware scheduling
- Shift roles and types
- Worker assignment
- Integration with listing module

:::info The Allocation → Rostering Handoff
Receptor's core value is *allocation* (Who is where for 3 months). Rostering integration extends this by connecting to downstream systems that manage *shifts* (Who is working Tuesday night). This strategic service bridges the gap between quarterly planning and daily operations.
:::

---

## Related Documentation

- [Product Roadmap](./product-roadmap.md) — Timeline-based view of capability development
- [V/TO (Scope & Boundaries)](../../operations/eos/vto.md#scope--boundaries) — Functional boundaries and exclusions
- [Vocational Training Analysis](../research/vocational-training-analysis.md) — Market research for extension services
