# Karrar Delivery Dashboard

The operations dashboard for **Karrar Delivery Services**: orders, delivery agents,
traders, users and reports in one place, in English and Arabic, light and dark.

## Features

- **Dashboard**: today's orders and deliveries, orders under delivery, delayed
  deliveries, revenue (delivery fees) and net profit for the month, orders per month
  against last year, and each agent's deliveries and cash to collect today.
- **Orders**: search by invoice, quick views (Today, Under delivery, Delayed,
  Pending), filters (status, trader, customer phone, dates, amount), personal saved
  views, column and density settings, add / edit / delete, status changes from the
  list or in bulk, order details with history, Excel import and export.
- **Delivery agents, traders and users**: lists with filters, add / edit / delete,
  enable or disable users, admin and normal roles.
- **Reports**: daily report per trader with totals and Excel export, and the traders
  financial report by delivered date.
- **Sign-in**: phone number with country key (UAE, KSA, Sudan), remembered user,
  clear messages, session expiry handling.
- **Arabic (right-to-left) and English**, **light and dark** themes, quick search
  (Ctrl / ⌘ + K), phone layout.

## Tech stack

Vue 2.7 · Vue Router · Vue Material · axios · vue-select · vue2-datepicker · Sass

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run serve        # development server on http://localhost:3000
npm run build        # production build in dist/
npm run lint         # code checks
```

### Backend address

The app talks to the Karrar Delivery API.

| Setting | Where | Default |
| --- | --- | --- |
| `VUE_APP_API_URL` | `.env.production`, `.env.local` or the environment | `http://localhost:8080` in development, the production API otherwise |

`npm run share` serves the app for a tunnel (see `.env.share`) and forwards API calls
to a local backend.

## Project structure

```
src/
├── main.js                 app entry: router, plugins, start-up
├── App.vue
├── routes/                 pages and access rules (admin-only pages)
├── pages/                  Dashboard, Orders, Delivery Agents, Traders, Users, Reports, Login
│   └── Layout/             sidebar, top bar, phone menu, page layout
├── components/             shared parts: order form, order details, dropdowns, dates,
│                           phone input, charts, language button, notifications …
├── services/               API calls (orders, traders, agents, users, dashboard, auth)
├── plugins/                core UI, theme, language, auth, network status, accessibility
├── i18n/                   Arabic translations
└── assets/
    ├── img/                logos and icons
    └── scss/               app.scss (entry) and md/ (base styles + _karrar-theme.scss)
public/                     index.html, favicons, web app manifest
```

## Languages

English text is written directly in the code; Arabic translations live in
`src/i18n/ar.js`. Use `$tt("Text")` in templates and add the Arabic line to `ar.js`.

## Deployment

The app is a static site: build it with `npm run build` and serve the `dist/` folder.
Set `VUE_APP_API_URL` to the API address of that environment.

## Tests

The automated end-to-end tests (Playwright) live in the separate `Test` folder next to
this project. See its README.

---

© Karrar Delivery Services. All rights reserved.
