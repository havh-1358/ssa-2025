<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0 (MINOR: new principle VI added; principles II and IV
materially expanded; Supabase added to tech stack)

Modified principles:
  - II. Design System Fidelity → II. Design System Fidelity & Platform UI Guidelines
    (added: Material Design / HIG / responsive web requirements)
  - IV. Clean Layered Architecture → IV. Clean Layered Architecture & Code Quality
    (added: explicit clean code rules — function size, naming, nesting, magic values)

Added sections:
  - VI. OWASP Security Standards (new principle)

Removed sections: None

Templates requiring updates:
  - ✅ .momorph/templates/plan-template.md — Constitution Check section already aligns;
    security and platform UI rows added by implication
  - ✅ .momorph/templates/spec-template.md — TR-002 security row covers new Principle VI
  - ✅ .momorph/templates/tasks-template.md — Security hardening task in Polish phase aligns
  - ✅ .momorph/guidelines/frontend.md — Platform UI guidance consistent with updated Principle II
  - ✅ .momorph/guidelines/backend.md — Layer conventions consistent with updated Principle IV

Follow-up TODOs:
  - None; all placeholders resolved
-->

# SSA 2025 Constitution

## Core Principles

### I. Type Safety First

All TypeScript code MUST be written in strict mode with no `any` escape hatches.
Immutability is mandatory: data structures MUST be created fresh rather than mutated
in place. Prefer `const`, spread operators, and `Object.freeze` over reassignment.
Zod MUST be used to validate all external inputs (user input, API responses, env vars)
at system boundaries; internal data passing between trusted layers needs no redundant
re-validation.

**Rationale**: TypeScript strict mode catches entire categories of runtime errors at
compile time. Immutability eliminates a wide class of state-related bugs and makes data
flow predictable. Input validation at boundaries is the primary defense against injection
and data-integrity failures.

### II. Design System Fidelity & Platform UI Guidelines

All UI code MUST derive visual values exclusively from design tokens defined as CSS
variables in the global stylesheet (e.g., `app/globals.css`). Hard-coded colors, spacing,
radii, or typography values in component files are FORBIDDEN. Tailwind utility classes
that map to those tokens (e.g., `bg-primary`, `text-brand-500`) MUST be preferred over
inline `style` attributes.

All navigation `href` values and routing logic MUST be sourced from `.momorph/contexts/SCREENFLOW.md`
and the relevant `group_specs/*.md` files. Guessing or assuming any URL is FORBIDDEN.
If a destination is not documented, implementation MUST stop and the gap MUST be reported.

**Platform UI compliance** — components MUST follow the conventions of their target platform:

- **Web**: Responsive design is mandatory. Layouts MUST adapt to mobile (≥ 320 px),
  tablet (≥ 768 px), and desktop (≥ 1280 px) breakpoints. Touch targets MUST be
  ≥ 44 × 44 px. WCAG 2.1 AA accessibility MUST be met.
- **Android** (if applicable): Follow [Material Design 3](https://m3.material.io/) —
  use Material components, elevation, motion, and color system conventions.
- **iOS** (if applicable): Follow [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) —
  use native navigation patterns, SF Symbols, and platform typography scales.

Cross-platform divergence MUST be documented in the spec; UI parity for its own sake
is NOT required when platform conventions differ.

**Rationale**: Hard-coded values make theme updates a search-and-replace exercise prone
to misses. Undocumented routes create silent mismatches between design intent and code.
Platform UI guidelines exist because users have strong internalized expectations per
platform; violating them degrades usability even if the design is otherwise correct.

### III. Test-First Development (NON-NEGOTIABLE)

The Red–Green–Refactor cycle MUST be followed for every feature and bug fix:

1. Write a failing test that captures the requirement (RED).
2. Obtain stakeholder or author approval of the test intent.
3. Implement the minimal code to make the test pass (GREEN).
4. Refactor for clarity and quality while keeping tests green (IMPROVE).

Minimum coverage targets: **80% unit/integration** across all source modules,
**100% coverage of critical user flows** via Playwright E2E tests.
Tests MUST be committed before the implementation they cover.

**Rationale**: Writing tests first forces precise requirement articulation and prevents
coverage from being an afterthought. The 80% floor is a minimum, not a goal ceiling.

### IV. Clean Layered Architecture & Code Quality

The dependency chain MUST flow in one direction only:
**Route Handler → Controller → Service → Repository/Utility**.

- **Route handlers**: HTTP-specific concerns only — parse request, call controller, return response.
- **Controllers**: Orchestrate services, map inputs/outputs; contain no business logic.
- **Services**: Pure business logic; must be testable without HTTP framework types.
- **Repositories/Utilities**: Data access and external-API calls only. Supabase client
  calls (queries, RPC, storage, auth) belong exclusively in this layer.

Circular imports are FORBIDDEN. Barrel `index.ts` re-exports are permitted only for
types and constants; never for service/controller/repository modules.

**Clean code rules** — all source files MUST comply:

- **Naming**: Identifiers MUST be descriptive and self-explanatory; abbreviations are
  FORBIDDEN unless universally understood (e.g., `id`, `url`, `api`).
- **Function size**: Functions MUST NOT exceed 50 lines. Extract helpers aggressively.
- **File size**: Files MUST NOT exceed 800 lines; target 200–400 lines with single responsibility.
- **Nesting depth**: Maximum 4 levels of nesting; prefer early returns and guard clauses.
- **Magic values**: Hard-coded numbers and strings MUST be extracted to named constants
  or configuration. The only permitted literal values are `0`, `1`, `-1`, `true`, `false`,
  and `""` (empty string) where their meaning is unambiguous from context.
- **No dead code**: Unused variables, functions, imports, and commented-out code MUST
  NOT be committed. Remove, do not comment out.
- **No console statements**: `console.log` / `console.error` in production paths are
  FORBIDDEN; use a structured logger.

File naming MUST follow: `kebab-case` for non-component modules (e.g., `user-service.ts`),
`PascalCase` for React components and classes (e.g., `UserCard.tsx`, `AuthService.ts`).

**Rationale**: A strict dependency direction eliminates circular-import issues and keeps
each layer independently testable. Clean code rules reduce cognitive load, make diffs
smaller, and prevent the gradual entropy that accumulates in fast-moving codebases.

### V. Documentation-Driven Feature Flow

No feature implementation MAY begin until these artifacts exist and are reviewed:
`spec.md` (requirements + acceptance criteria), `plan.md` (architecture and risk
assessment), and `tasks.md` (task breakdown). The `momorph.specs → momorph.plan →
momorph.tasks → momorph.implement` workflow MUST be followed in order.

Implementation plans MUST include an explicit **Constitution Compliance Check** gate
(see `plan-template.md`). Any deliberate deviation from a constitutional principle
MUST be documented in that gate with a justification and the alternative considered.

**Rationale**: Skipping planning artifacts leads to discovered-late misalignments with
design intent and architectural principles. The gate makes deviations visible and
deliberate rather than accidental.

### VI. OWASP Security Standards

All code MUST comply with the [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/).
The following controls are non-negotiable:

**Input & output**:
- All user-supplied data MUST be validated server-side via Zod (see Principle I); client-side
  validation is supplementary only.
- HTML output MUST be escaped to prevent XSS. React's JSX escaping is sufficient for
  React-rendered content; `dangerouslySetInnerHTML` is FORBIDDEN unless explicitly
  approved with a sanitization step.
- SQL and database queries MUST use parameterized statements or ORM-generated queries;
  string interpolation into queries is FORBIDDEN.

**Authentication & session**:
- Authentication MUST be implemented via Supabase Auth; custom auth schemes require
  explicit architectural justification.
- JWTs and session tokens MUST be stored in `HttpOnly`, `Secure`, `SameSite=Strict`
  cookies; `localStorage` storage of tokens is FORBIDDEN.
- Passwords MUST never be stored; Supabase Auth handles hashing automatically.

**Access control**:
- Row-Level Security (RLS) MUST be enabled on all Supabase tables that hold user data.
  No table MAY be publicly readable/writable without explicit justification in the spec.
- API routes MUST verify authorization on every request; no route MAY assume a prior
  middleware has already validated identity.

**Secrets & configuration**:
- Secrets (API keys, service role keys, tokens) MUST be stored in environment variables
  and MUST NOT appear in source code, logs, or error messages.
- The Supabase `service_role` key MUST only be used in server-side code; it MUST NEVER
  be exposed to the client.

**Error handling**:
- Error responses MUST NOT leak stack traces, internal paths, or database schema details
  to clients. Log full errors server-side; return generic messages client-side.

**Security review gate**: Any PR touching authentication, authorization, input handling,
or external API integration MUST be reviewed against this principle before merge.

**Rationale**: OWASP Top 10 vulnerabilities account for the majority of real-world
breaches. Codifying controls at the constitutional level ensures they are evaluated at
design time, not discovered in production.

## Technology Stack & Conventions

**Runtime**: Node.js / Next.js 16.x (App Router)
**Language**: TypeScript 5 — strict mode, `noEmit`, `isolatedModules`
**UI framework**: React 19
**Styling**: Tailwind CSS 4 with CSS variable–based design tokens
**Validation**: Zod at all external boundaries
**BaaS / Database**: Supabase — PostgreSQL, Auth, Storage, Realtime, Edge Functions
**ORM / Query layer**: Supabase JS client (default); Prisma permissible for complex
queries with justification; raw SQL via parameterized Supabase RPC only
**Testing (unit/integration)**: Jest or Vitest — project convention applies
**Testing (E2E)**: Playwright — Page Object Model mandatory
**Linting**: ESLint (eslint-config-next); all lint errors MUST be zero before merge

**Supabase conventions**:
- All Supabase client instantiation MUST use environment variables:
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side;
  `SUPABASE_SERVICE_ROLE_KEY` for server-side only, never exposed to the browser.
- Row-Level Security (RLS) is mandatory on all user-data tables (see Principle VI).
- Supabase migrations MUST be tracked under `supabase/migrations/`; schema changes
  MUST NOT be applied manually to production without a migration file.
- Storage bucket policies MUST be explicitly defined; default public access is FORBIDDEN.

Asset placement: `public/assets/{group_name}/{icons|images|logos}/` with kebab-case
filenames. Import via `/assets/{group_name}/...`.

Sensitive fields (passwords, tokens) MUST be excluded from serialized responses
using `@Exclude()` or equivalent DTO-level mapping. Secrets MUST come from
environment variables; hard-coded secrets in any file are FORBIDDEN.

## Development Workflow

1. **Design Analysis**: Run `/momorph.specs` to extract Figma specifications.
2. **Specification**: Run `/momorph.specify` to create `spec.md`.
3. **Planning**: Run `/momorph.plan` to produce `plan.md` including Constitution Check.
4. **Task Breakdown**: Run `/momorph.tasks` to produce `tasks.md`.
5. **Test Cases**: Run `/momorph.createtestcases` before writing implementation code.
6. **Implementation**: Run `/momorph.implement` following TDD (Principle III).
7. **Security Review**: Verify Principle VI compliance before raising a PR on any
   auth/input/API-integration change.
8. **Review**: Run `/momorph.reviewe2e` before merging E2E test changes.
9. **Commit**: Run `/momorph.commit` for standardized conventional commit messages.

Commit format: `<type>: <description>` where type ∈ {feat, fix, refactor, docs, test,
chore, perf, ci}. PR descriptions MUST reference the spec.md and list the tested
acceptance scenarios.

All PRs MUST pass: TypeScript compilation with zero errors, ESLint with zero errors,
unit/integration test suite at ≥ 80% coverage, and Playwright smoke suite green.

## Governance

This constitution supersedes all other project guidelines for decisions it addresses.
Guidelines in `.momorph/guidelines/` elaborate on principles but MUST NOT contradict them;
if a conflict is discovered, the constitution wins and the guideline MUST be updated.

**Amendment procedure**:
1. Author proposes amendment with: principle(s) affected, rationale, migration plan.
2. Amendment reviewed by at least one other team member.
3. Version bumped (MAJOR for removals/redefinitions, MINOR for additions, PATCH for
   clarifications) and `LAST_AMENDED_DATE` updated.
4. Dependent templates and guidelines updated in the same commit.

**Compliance**: All PRs and code reviews MUST verify adherence to each applicable
principle. Violations not documented in the plan's Constitution Check gate are grounds
for blocking merge.

**Runtime guidance**: See `.momorph/guidelines/frontend.md` and `.momorph/guidelines/backend.md`
for detailed implementation conventions that elaborate on Principles II and IV.

**Version**: 1.1.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22
