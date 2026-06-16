# Changelog

All notable changes to this project are documented here.

For AI assistants resuming work without chat history, see **[docs/AI_SESSION_CONTEXT.md](./docs/AI_SESSION_CONTEXT.md)**.

## 2026-06-16 — Contact form hardening + analytics + documentation

### Added
- **Phone formatting** — `src/lib/phone.js`; `ContactForm` formats input as `(xxx) xxx-xxxx`
- **Google reCAPTCHA v2** — checkbox on Contact/Get Quote forms when `VITE_RECAPTCHA_SITE_KEY` is set; server verification in `api/src/functions/contact.js` via `RECAPTCHA_SECRET_KEY`
- **Google Analytics 4** — `src/lib/analytics.js`, `src/components/analytics/PageViewTracker.jsx`; tracks route changes when `VITE_GA_MEASUREMENT_ID` is set
- **`.env.example`** — local frontend env template
- **`docs/ARCHITECTURE_AND_DEPLOYMENT.md`** — full Azure/contact-form architecture, CORS explanation, troubleshooting
- **`docs/AI_SESSION_CONTEXT.md`** — condensed reference for future AI sessions
- **`react-google-recaptcha`** npm dependency

### Changed
- **`src/components/shared/ContactForm.jsx`** — phone mask, reCAPTCHA, `captchaToken` in POST body
- **`api/src/functions/contact.js`** — phone pattern validation, `verifyRecaptcha()`
- **`src/App.jsx`** — mounts `PageViewTracker`
- **`.github/workflows/main_sabatino.yml`** — passes `VITE_RECAPTCHA_SITE_KEY`, `VITE_GA_MEASUREMENT_ID` at build time
- **`api/local.settings.json.example`** — added `RECAPTCHA_SECRET_KEY`
- **`README.md`** — links to architecture docs; updated contact-form config list

### Pending user setup
- Create reCAPTCHA v2 keys → `VITE_RECAPTCHA_SITE_KEY` (GitHub) + `RECAPTCHA_SECRET_KEY` (Azure)
- Create GA4 property → `VITE_GA_MEASUREMENT_ID` (GitHub), then redeploy website

---

## 2026-06-16 — Contact API deployed (Azure Functions + SMTP2GO)

### Added
- **`api/`** — Azure Functions v4 (Node 24) contact endpoint
  - `api/src/functions/contact.js` — `POST /api/contact`, nodemailer → SMTP2GO
  - `api/package.json`, `api/host.json`, `api/src/index.js`
- **`.github/workflows/main_sabatino-contact-api.yml`** — deploy `api/` to Function App `sabatino-contact-api` (via Azure Deployment Center OIDC)
- GitHub variable **`VITE_CONTACT_API_URL`** — baked into frontend at build time
- **`ContactForm.jsx`** wired to Azure Function (replaces Base44)

### Changed
- **`.github/workflows/main_sabatino.yml`** — injects `VITE_CONTACT_API_URL` during build
- Fixed Azure-generated workflow: `AZURE_FUNCTIONAPP_PACKAGE_PATH: 'api'` (was `.` / repo root)

### Removed
- **`.github/workflows/azure-function.yml`** — failed duplicate using website OIDC secrets

### Azure configuration
| Resource | Name | Notes |
|----------|------|-------|
| Function App | `sabatino-contact-api` | Flex Consumption, Linux, Node 24, Canada Central |
| API URL | `...canadacentral-01.azurewebsites.net/api/contact` | See `VITE_CONTACT_API_URL` |
| Email | SMTP2GO | Credentials in Function App env vars |
| CORS (Portal) | `www` + apex domains | **Required** for browser form (see docs) |

### Issues resolved
- Function 404 until deployed from `api/` folder
- Publish profile 401 → switched to OIDC Deployment Center workflow
- Form “Load failed” in browser → Function App Portal CORS origins added
- Test emails from `curl` during verification (not user submissions)

---

### Added
- **`public/images/`** — 28 images downloaded locally (logo, hero, services, carrier logos)
- **`src/lib/images.js`** — centralized image path constants

### Changed
- All pages and layout components now use local `/images/...` paths instead of `media.base44.com` CDN URLs
- **`index.html`** favicon now points to `/images/logo.png`

### Removed
- Empty **`base44/`** folder
- **85 duplicate `* 2.*` files** (macOS Finder copies accidentally created in the project)

### Result
No Base44 references remain in source code, dependencies, or image hosting.

---

## 2026-06-13 — Azure deployment fix

### Changed
- **`.github/workflows/main_sabatino.yml`** — Azure-generated workflow updated to:
  - Use `npm ci` instead of `npm install` (reproducible CI builds)
  - Build with Node 24 and npm cache
  - Copy `staticwebapp.config.json` into `dist/` after build
  - Upload and deploy **only `dist/`** (built static site), not the full source repo

### Removed
- **`.github/workflows/azure-webapp.yml`** — duplicate workflow that required manual publish-profile secrets and was not configured. Azure Deployment Center already provides OIDC-based auth via `main_sabatino.yml`.

### Documentation
- **`README.md`** — deployment section updated to describe the Azure Deployment Center setup, OIDC secrets, and required App Service startup command.

### Why
The original Azure workflow deployed the entire repository (source + `node_modules`). This site is a Vite React SPA — only the built output in `dist/` should be published. Two workflows were also running on every push; one would fail due to missing secrets.

---

## 2026-06-12 — Standalone app (Base44 removal)

### Removed
- **`@base44/sdk`** and **`@base44/vite-plugin`** npm dependencies
- **`src/api/base44Client.js`** — Base44 API client
- **`src/lib/app-params.js`** — Base44 app ID / URL / token handling
- **`base44/`** — Base44 builder config (`config.jsonc`, `.app.jsonc`, `entities/User.jsonc`)
- Base44 Vite plugin from **`vite.config.js`**
- Startup auth gate in **`App.jsx`** (loading spinner, auth errors, redirect to login)
- Base44 auth check in **`PageNotFound.jsx`**

### Added
- **`src/api/auth.js`** — auth stub with placeholder methods for a future backend
- **`@/` path alias** in `vite.config.js` (previously provided by Base44 plugin)
- **`.nvmrc`** — Node 24
- **`staticwebapp.config.json`** — SPA routing fallback config
- **`engines.node: ">=24"`** in `package.json`

### Changed
- **`src/lib/AuthContext.jsx`** — simplified to a no-op stub (no network calls)
- **`App.jsx`** — routes render directly without auth checks
- **`package.json`** — renamed from `base44-app` to `saba-shield-pro`
- **Auth pages** (`Login`, `Register`, `ForgotPassword`, `ResetPassword`) — now call `src/api/auth.js` stub instead of Base44 SDK (pages exist but are not routed yet)
- **`index.html`** — favicon changed from Base44 logo to Sabatino logo
- **`README.md`** — rewritten for standalone local dev and Azure deployment

### Unchanged (intentional)
- Image URLs still point to `media.base44.com` CDN. These are static assets, not backend calls. Migrate to `public/images/` when ready for full independence.

---

## 2026-06-12 — Initial GitHub + Azure setup

### Added
- Git repository initialized and pushed to `github.com/sabatino-git-account/website`
- **`.github/workflows/main_sabatino.yml`** — created by Azure Deployment Center when GitHub was connected
- GitHub secrets (auto-created by Azure):
  - `AZUREAPPSERVICE_CLIENTID_*`
  - `AZUREAPPSERVICE_TENANTID_*`
  - `AZUREAPPSERVICE_SUBSCRIPTIONID_*`

### Azure configuration
| Setting | Value |
|---------|--------|
| Service | Azure App Service (Web App) |
| App name | `sabatino` |
| OS | Linux |
| Runtime | Node 24 LTS |
| Deploy trigger | Push to `main` |
| Startup command | `npx -y serve -s /home/site/wwwroot -l $PORT --no-clipboard` |

---

## Architecture (current state)

```
GitHub (monorepo: React site + api/)
    │
    ├─ push main ─► main_sabatino.yml ─► npm build (VITE_* vars) ─► dist/ ─► Web App sabatino
    │                                                                      └─► www.sabatino-ins.com
    │
    └─ push api/** ─► main_sabatino-contact-api.yml ─► zip api/ ─► Function App sabatino-contact-api
                                                                              └─► POST /api/contact ─► SMTP2GO
```

### Documentation index

| Doc | Audience |
|-----|----------|
| [README.md](./README.md) | Quick start, deploy overview |
| [docs/ARCHITECTURE_AND_DEPLOYMENT.md](./docs/ARCHITECTURE_AND_DEPLOYMENT.md) | Full setup, CORS, troubleshooting |
| [docs/AI_SESSION_CONTEXT.md](./docs/AI_SESSION_CONTEXT.md) | AI assistants — facts, file map, checklist |
| [CHANGELOG.md](./CHANGELOG.md) | Dated change history |

### Future work
- [ ] Implement real auth in `src/api/auth.js` and wire `AuthContext.jsx`
- [ ] Route login/register pages when auth backend is ready
- [x] Self-host images (moved to `public/images/`)
- [x] Connect contact form to email/API backend (Azure Function + SMTP2GO)
- [x] Custom domain setup — `www.sabatino-ins.com` live
- [ ] Configure reCAPTCHA keys (`VITE_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`)
- [ ] Configure GA4 (`VITE_GA_MEASUREMENT_ID`)
