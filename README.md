# Khady's Kitchen — Frontend

The web client for **Khady's Kitchen**, a Kumasi patisserie and bake school. It serves the public storefront (shop, trainings, gallery, contact), guest checkout with Paystack, order and application tracking, and a complete admin console for running the business — all against the Khady's Kitchen backend API.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Client data | RTK Query — one `createApi`, feature endpoints via `injectEndpoints` |
| Server data | Plain `fetch` helpers with 1h ISR + on-demand revalidation |
| Forms | react-hook-form + Zod v4 |
| Styling | Tailwind CSS v4 (`@theme` tokens), hand-rolled UI kit in `src/components/ui/` |
| Payments | Paystack (redirect flow) |
| Bot protection | Cloudflare Turnstile (optional) + honeypot on public forms |
| Testing | Vitest, Testing Library, jsdom |

## Features

### Public site
- **Landing** — hero, featured bakes and classes, editable "Our Story"; server-rendered with 1-hour ISR, revalidated on demand when admins edit content.
- **Shop** — server-rendered catalogue and product pages, localStorage cart with cross-tab sync, guest checkout keyed by phone number, pay online (Paystack) or on pickup, order tracking by `KK-O` code with balance payment.
- **Bake School** — class catalogue and detail pages, application form with pay-now/pay-later, application status lookup by `KK-A` receipt code.
- **Gallery, contact, legal** — photo gallery with slideshow/grid views, contact form, privacy and terms pages.
- **SEO** — per-page metadata with canonicals, branded Open Graph cards generated in code (`src/lib/og-template.tsx`), dynamic sitemap fed by live product/class slugs, robots rules, PWA manifest.

### Admin console (`/admin`)
- Dashboard with revenue chart, best sellers, and stats over a selectable range.
- CRUD for shop items, classes, and gallery photos; management screens for orders, applications, students, customers, and the unified payment ledger.
- Team management with three roles (`SUPER_ADMIN` / `ADMIN` / `STAFF`), append-only audit log browser, editable website content, and own-profile security (password change, email-code 2FA).

## Architecture notes

- **One API slice.** All client data flows through `src/redux/api-slice.ts` (`${NEXT_PUBLIC_SERVER_URI}/api/v1`, cookies included). Features attach endpoints with `injectEndpoints` in per-feature directories under `src/redux/`. The store is a per-request factory so SSR never leaks state between requests.
- **Auth.** httpOnly cookie sessions with automatic 401 → refresh → retry, mutex-guarded against refresh stampedes. `src/proxy.ts` does a cheap cookie-presence gate on `/admin`; the real authority is `RequireAuth` calling `GET /auth/me`. Optional email-code 2FA.
- **Server rendering.** Public pages fetch through `src/lib/public-api.ts`, which returns a `found | not-found | error` result so pages can distinguish a real 404 (`notFound()`) from a backend hiccup (retry island).
- **Payments.** The backend owns pricing and initializes Paystack; the client stashes the order/receipt code in sessionStorage, redirects, and verifies on `/shop/verify` or `/trainings/verify`. Amounts are integer pesewas end-to-end.
- **Images.** Uploads are downscaled client-side (`src/lib/optimize-image.ts`) before the backend stores them in Cloudinary.
- **Revalidation.** `POST /api/revalidate` accepts an allowlist of public paths (`/`, `/shop`, `/trainings`, `/gallery`) and is called fire-and-forget after every admin mutation that changes public content.

## Getting started

Requires the Khady's Kitchen backend API running locally (default port 4050).

```bash
cp .env.example .env   # defaults point at http://localhost:4050
npm install
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URI` | Yes | Backend origin, no trailing slash (`/api/v1` is appended). The app fails fast at boot if missing. |
| `NEXT_PUBLIC_BASE_URL` | No | Canonical site URL for metadata, OG cards, and the sitemap. Falls back to the production domain. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key for public forms. Unset → forms submit without the challenge. |

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm test` / `npm run test:watch` | Vitest suite (unit, component, integration — no backend needed) |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/          # Routes: public site, shop, trainings, auth, /admin console,
                # sitemap/robots/manifest, per-route opengraph-image files
  components/   # ui/ kit + feature components (shop, trainings, gallery, admin, …)
  redux/        # api-slice.ts + per-feature injectEndpoints
  lib/          # site config, SEO builder, OG template, public-api fetchers, cart store
  hooks/        # use-auth-role, use-table-query, …
  validations/  # Zod schemas shared by forms
  types/        # API + domain types
test/           # unit / component / integration suites
```

## Deployment

Any Node host that runs `next build && next start`. Set the environment variables above; point `NEXT_PUBLIC_SERVER_URI` at the deployed API and `NEXT_PUBLIC_BASE_URL` at the public domain so canonicals, OG cards, and the sitemap resolve correctly.
