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

This is a **marketing SPA** (not SSR). Base44 backend was fully removed. Auth is a stub only.

---

## Azure resources

| Resource | Name | Role |
|----------|------|------|
| Web App | `sabatino` | Serves built static site from `dist/` |
| Function App | `sabatino-contact-api` | `POST /api/contact` → SMTP2GO email |
| Email provider | SMTP2GO | `mail.smtp2go.com:587` |

### URLs

- **Website:** `https://www.sabatino-ins.com`
- **Function API:** `https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact`
- **Function region:** Canada Central, Flex Consumption, Linux, Node 24

### Web App startup command

```
npx -y serve -s /home/site/wwwroot -l $PORT --no-clipboard
```

---

## Deployment workflows

| Workflow file | Deploys | Trigger |
|---------------|---------|---------|
| `.github/workflows/main_sabatino.yml` | `dist/` → Web App `sabatino` | Every push to `main` |
| `.github/workflows/main_sabatino-contact-api.yml` | `api/` zip → Function App | Push when `api/**` or workflow changes |

Both use **OIDC** (Azure Deployment Center). **Do not** use publish profiles.

**Critical:** Function workflow must use `AZURE_FUNCTIONAPP_PACKAGE_PATH: 'api'`. Azure originally generated `.` (repo root) — that deploys the wrong project.

**Removed:** `.github/workflows/azure-function.yml` (failed duplicate using wrong OIDC secrets).

---

## Configuration checklist

### ✅ Done (as of 2026-06-16)

- [x] Website deployed to Azure with custom domain + SSL
- [x] Contact API code in `api/` deployed via GitHub Actions
- [x] SMTP2GO credentials in Function App environment variables
- [x] `VITE_CONTACT_API_URL` GitHub variable set
- [x] Function App **Portal CORS** allows `www` and apex domains (form works in browser)
- [x] Phone auto-format `(xxx) xxx-xxxx` in `ContactForm`
- [x] reCAPTCHA v2 + GA4 **code** implemented (see pending keys below)

### ⏳ Pending user configuration (optional but recommended)

| Setting | Where | Status |
|---------|--------|--------|
| `VITE_RECAPTCHA_SITE_KEY` | GitHub Variables | User must create at [reCAPTCHA Admin](https://www.google.com/recaptcha/admin) |
| `RECAPTCHA_SECRET_KEY` | Function App env | Pairs with site key |
| `VITE_GA_MEASUREMENT_ID` | GitHub Variables | User must create GA4 property |

Until reCAPTCHA keys are set, form works without checkbox. Once `RECAPTCHA_SECRET_KEY` is in Azure, API enforces verification.

After adding any `VITE_*` variable, **re-run website workflow** (values are baked in at build time).

---

## Environment variables reference

### GitHub Actions → Variables (website build)

| Variable | Purpose |
|----------|---------|
| `VITE_CONTACT_API_URL` | Contact API endpoint (required for form) |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 site key (public) |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID (`G-XXXXXXXXXX`) |

### Function App → App settings

| Setting | Purpose |
|---------|---------|
| `SMTP_HOST` | `mail.smtp2go.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SMTP2GO username |
| `SMTP_PASSWORD` | SMTP2GO password |
| `MAIL_FROM` | Verified sender in SMTP2GO |
| `MAIL_TO` | `info@sabatino-ins.com` |
| `ALLOWED_ORIGIN` | `https://www.sabatino-ins.com,https://sabatino-ins.com` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret (server-side) |

### Function App → API → CORS (Portal)

Must include **both**:

- `https://www.sabatino-ins.com`
- `https://sabatino-ins.com`

**Why both code + Portal CORS:** Azure host intercepts browser `OPTIONS` preflight before function code runs. `curl` works without Portal CORS; browsers do not.

---

## Key source files

| File | Responsibility |
|------|----------------|
| `src/components/shared/ContactForm.jsx` | Contact + Get Quote form (phone format, reCAPTCHA, submit) |
| `src/lib/phone.js` | `formatPhoneInput()` → `(xxx) xxx-xxxx` |
| `src/lib/analytics.js` | GA4 init + `trackPageView()` |
| `src/components/analytics/PageViewTracker.jsx` | Route-change pageview tracking |
| `src/App.jsx` | Routes; mounts `PageViewTracker` |
| `api/src/functions/contact.js` | HTTP handler: validate, reCAPTCHA verify, send email |
| `api/local.settings.json.example` | Local function env template |
| `.env.example` | Local frontend env template |
| `docs/ARCHITECTURE_AND_DEPLOYMENT.md` | Full architecture + troubleshooting |
| `CHANGELOG.md` | Dated change log |

### Pages using ContactForm

- `src/pages/Contact.jsx`
- `src/pages/GetQuote.jsx`

### Images / branding

- Logo in navbar/footer: `public/images/saba_icon.png` + text “Sabatino / Insurance Agency”
- Favicon: `public/images/saba_logo.png`
- Untracked locally (not used in site): `logo_transparent.png`

---

## Contact form data flow

```
Browser (www.sabatino-ins.com)
  → OPTIONS preflight (Azure Portal CORS must allow origin)
  → POST JSON to VITE_CONTACT_API_URL
  → api/src/functions/contact.js
      → validate fields + phone pattern + smsConsent
      → verifyRecaptcha(captchaToken) if RECAPTCHA_SECRET_KEY set
      → nodemailer → SMTP2GO
  → { "ok": true }
```

### POST body fields

`name`, `email`, `phone`, `company`, `interest`, `message`, `smsConsent`, `captchaToken`, `_gotcha` (honeypot)

### Phone validation

- Frontend: formats while typing via `formatPhoneInput`
- Backend: if provided, must match `(xxx) xxx-xxxx` (10 digits)

---

## Issues solved (do not re-debug)

| Symptom | Root cause | Fix |
|---------|------------|-----|
| `/api/contact` 404 | Function never deployed | Deployment Center + `api/` workflow |
| Deploy succeeds, still 404 | Workflow deployed repo root | `AZURE_FUNCTIONAPP_PACKAGE_PATH: 'api'` |
| Publish profile 401 | Bad/expired profile | OIDC via Deployment Center |
| “Resource doesn't exist” on function deploy | Website OIDC secrets used for function | Separate secrets per app |
| Form “Load failed” (Safari) | Missing Portal CORS | Function App → API → CORS |
| curl works, browser fails | Same — CORS preflight blocked | Portal CORS + `ALLOWED_ORIGIN` |
| 3 emails “Test / test@example.com” | Agent `curl` verification tests | Not a bug |

---

## Local development

```bash
# Website
npm install && npm run dev          # http://localhost:5173

# API (separate terminal)
cp api/local.settings.json.example api/local.settings.json
cd api && npm install && npm start  # http://localhost:7071/api/contact

# Frontend env (optional)
cp .env.example .env.local
# VITE_CONTACT_API_URL=http://localhost:7071/api/contact
```

---

## Commands for verification

```bash
# API health (no CORS involved)
curl -X POST "https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello","smsConsent":true}'

# Check baked API URL in live site JS
curl -sL "https://www.sabatino-ins.com/" | grep -o 'assets/index-[^"]*\.js' | head -1
```

---

## Future / not implemented

- Real auth (`src/api/auth.js` stub; login pages exist but unrouted)
- Public on-site visitor counter widget (GA4 dashboard used instead)
- Rate limiting on contact API

---

## Instructions for AI assistants

1. **Read this file first** when resuming work on deploy, contact form, CORS, or Azure.
2. **Read `docs/ARCHITECTURE_AND_DEPLOYMENT.md`** for troubleshooting steps and diagrams.
3. **Never commit** `.env.local`, `api/local.settings.json`, or SMTP/recaptcha secrets.
4. **Website env vars** (`VITE_*`) require rebuild + redeploy; **Function env vars** apply without redeploy.
5. **Two workflows** — website changes go to `main_sabatino.yml`; API changes to `main_sabatino-contact-api.yml`.
6. **User prefers** concise changes; match existing code style; only commit when asked.
