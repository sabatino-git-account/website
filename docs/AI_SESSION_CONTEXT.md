# AI session context

> **Purpose:** Persistent reference for AI assistants when chat history is unavailable.  
> **Last updated:** 2026-06-16  
> **Human-readable deep dive:** [ARCHITECTURE_AND_DEPLOYMENT.md](./ARCHITECTURE_AND_DEPLOYMENT.md)  
> **Change history:** [CHANGELOG.md](../CHANGELOG.md)

---

## Project at a glance

| Item | Value |
|------|--------|
| **Local path** | `/Users/bryanle/Documents/Projects/saba-shield-pro` |
| **GitHub repo** | `github.com/sabatino-git-account/website` |
| **Branch** | `main` |
| **Stack** | React 18 + Vite 6 + Tailwind + React Router |
| **Node version** | 24 (`.nvmrc`, `package.json` engines) |
| **Production domain** | `https://www.sabatino-ins.com` (also `sabatino-ins.com`) |

Marketing SPA. Base44 removed. Auth is a stub only (login pages not routed).

---

## Azure resources

| Resource | Name | Role |
|----------|------|------|
| Web App | `sabatino` | Serves `dist/` static site + Teams chat script |
| Function App | `sabatino-contact-api` | `POST /api/contact` → SMTP2GO email |
| Email | SMTP2GO | `mail.smtp2go.com:587` |
| Analytics | Google Analytics 4 | `G-7DW2Q54FRF` |
| Live chat | Microsoft Teams Customer Connect | `environmentId` in `TeamsLiveChat.jsx` |

### URLs

- **Website:** `https://www.sabatino-ins.com`
- **Function API:** `https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact`
- **Function region:** Canada Central, Flex Consumption, Linux, Node 24

---

## Deployment workflows

| Workflow | Deploys | Trigger |
|----------|---------|---------|
| `main_sabatino.yml` | `dist/` → Web App `sabatino` | Every push to `main` |
| `main_sabatino-contact-api.yml` | `api/` zip → Function App | Push when `api/**` or workflow changes |

Both use **OIDC** from Azure Deployment Center. Function workflow **must** use `AZURE_FUNCTIONAPP_PACKAGE_PATH: 'api'`.

---

## Configuration checklist (production)

### ✅ Configured

- [x] Website + custom domain + SSL
- [x] Contact API deployed from `api/`
- [x] SMTP2GO in Function App env vars
- [x] `VITE_CONTACT_API_URL` (GitHub)
- [x] Function Portal CORS (`www` + apex)
- [x] `VITE_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` (reCAPTCHA **v3**)
- [x] `VITE_GA_MEASUREMENT_ID` = `G-7DW2Q54FRF`
- [x] Phone format `(xxx) xxx-xxxx`
- [x] API security: rate limit, hostname/action/score checks, fail-closed CAPTCHA
- [x] Microsoft Teams live chat (site-wide)
- [x] reCAPTCHA badge bottom-left (avoids chat overlap)

### ⏳ Optional future

- Azure Front Door / API Management for stronger rate limiting
- Real auth backend

---

## Environment variables

### GitHub Variables (website build — baked into `dist/`)

| Variable | Purpose |
|----------|---------|
| `VITE_CONTACT_API_URL` | Contact API endpoint |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (public) |
| `VITE_GA_MEASUREMENT_ID` | `G-7DW2Q54FRF` |

### Function App settings

| Setting | Purpose |
|---------|---------|
| `SMTP_*`, `MAIL_FROM`, `MAIL_TO` | Email delivery |
| `ALLOWED_ORIGIN` | `https://www.sabatino-ins.com,https://sabatino-ins.com` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret (**required in prod**) |
| `RECAPTCHA_OPTIONAL` | `true` local dev only — **never in Azure prod** |
| `RECAPTCHA_MIN_SCORE` | Optional (default `0.5`) |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | Optional rate limit tuning |

### Teams chat (in code, not env)

File: `src/components/chat/TeamsLiveChat.jsx`

- `environmentId`: `b2e5815c-388f-e355-b74d-34ea7937fe1d`
- `region`: `unitedstates`

---

## Key source files

| File | Role |
|------|------|
| `src/components/shared/ContactForm.jsx` | Contact + Get Quote form |
| `src/components/shared/RecaptchaNotice.jsx` | Visible security notice (v3 is invisible) |
| `src/components/chat/TeamsLiveChat.jsx` | Microsoft Teams live chat |
| `src/components/layout/SiteLayout.jsx` | Navbar + Footer + Teams chat |
| `src/lib/phone.js` | Phone formatter |
| `src/lib/analytics.js` | GA4 |
| `src/components/analytics/PageViewTracker.jsx` | SPA pageview tracking |
| `src/index.css` | reCAPTCHA badge → bottom-left |
| `api/src/functions/contact.js` | Contact API handler |
| `api/src/lib/recaptcha.js` | CAPTCHA verify (hostname, action, score) |
| `api/src/lib/rateLimit.js` | Per-IP rate limit |

---

## Feature summary

| Feature | How it works |
|---------|----------------|
| **Contact form** | POST to Azure Function → SMTP2GO → `info@sabatino-ins.com` |
| **Phone** | Auto-formats to `(xxx) xxx-xxxx` |
| **reCAPTCHA v3** | Invisible on submit; Security notice on form; badge bottom-left |
| **GA4** | Tracks route changes; dashboard at analytics.google.com |
| **Teams chat** | Bubble bottom-right on all pages; messages to Teams |
| **Rate limit** | 5 req / 15 min / IP on contact API |

---

## Issues solved (do not re-debug)

| Symptom | Fix |
|---------|-----|
| `/api/contact` 404 | Deploy from `api/` folder |
| Form “Load failed” | Function App Portal CORS |
| “Invalid key type” reCAPTCHA | Switched v2 widget → v3 |
| Badge overlaps chat | `index.css` badge bottom-left |
| curl works, browser fails | Portal CORS |
| Test emails “Test / test@example.com” | Agent verification curls |

---

## Local development

```bash
npm install && npm run dev                    # http://localhost:5173

cp api/local.settings.json.example api/local.settings.json
# Set RECAPTCHA_OPTIONAL=true for local API testing without keys
cd api && npm install && npm start          # http://localhost:7071/api/contact

cp .env.example .env.local                  # optional VITE_* overrides
```

---

## Instructions for AI assistants

1. Read this file first; use `ARCHITECTURE_AND_DEPLOYMENT.md` for troubleshooting.
2. Never commit secrets (`.env.local`, `local.settings.json`).
3. `VITE_*` changes need website rebuild; Function env vars apply immediately.
4. reCAPTCHA is **v3** (not v2 checkbox) — do not re-add v2 widget without new v2 keys.
5. Teams chat + reCAPTCHA badge both use screen corners — badge is bottom-left by design.
6. Only commit when user asks.
