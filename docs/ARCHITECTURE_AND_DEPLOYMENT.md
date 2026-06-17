# Architecture, deployment, and troubleshooting

> **AI assistants:** Start with [AI_SESSION_CONTEXT.md](./AI_SESSION_CONTEXT.md) for a quick factsheet. This file is the full deep dive.

This document explains how the Sabatino Insurance website and contact-form backend are wired together, what we ran into during setup, and how to maintain it.

## Overview

The project is a **monorepo** with two deployable pieces:

| Piece | Azure resource | Purpose |
|-------|----------------|---------|
| React marketing site | Web App **`sabatino`** | Public website at `https://www.sabatino-ins.com` |
| Contact API | Function App **`sabatino-contact-api`** | Receives form POSTs and sends email via SMTP2GO |

SMTP credentials never go in the frontend. The browser only knows the API URL; secrets live in Azure Function App settings.

```mermaid
flowchart LR
  User[Visitor browser] -->|HTTPS| Site[www.sabatino-ins.com<br/>Azure Web App sabatino]
  Site -->|serves| SPA[React SPA from dist/]
  SPA -->|POST /api/contact<br/>cross-origin| API[sabatino-contact-api<br/>Azure Function]
  API -->|SMTP TLS| SMTP2GO[SMTP2GO]
  SMTP2GO -->|delivers| Inbox[info@sabatino-ins.com]
  GitHub[GitHub Actions] -->|deploy dist/| Site
  GitHub -->|deploy api/| API
```

## Contact form request flow

1. User fills out `ContactForm` on the site (Contact or Get Quote page).
2. React calls `fetch(VITE_CONTACT_API_URL, { method: 'POST', ... })`.
3. Browser sends a **CORS preflight** (`OPTIONS`) because the API is on a different host (`*.azurewebsites.net`).
4. If CORS allows the site origin, the browser sends the real `POST`.
5. Azure Function `contact` validates the payload, builds a plain-text email, and sends it with **nodemailer** → SMTP2GO.
6. Function returns `{ "ok": true }`; the UI shows the thank-you state.

### Frontend (`src/components/shared/ContactForm.jsx`)

- Reads API URL from `import.meta.env.VITE_CONTACT_API_URL` (baked in at **build time**).
- Formats phone as `(xxx) xxx-xxxx` while typing.
- Sends JSON: `name`, `email`, `phone`, `company`, `interest`, `message`, `smsConsent`, `captchaToken`.
- Google reCAPTCHA v3 (invisible on submit) with a visible **Security verification** notice when `VITE_RECAPTCHA_SITE_KEY` is set.
- Hidden `_gotcha` field for basic bot filtering.
- Requires SMS consent checkbox before submit.

### Backend (`api/src/functions/contact.js`)

- Route: `POST /api/contact` (and `OPTIONS` for CORS in code).
- Validates required fields, email format, and phone format when provided.
- Verifies reCAPTCHA token with Google when `RECAPTCHA_SECRET_KEY` is set (fail-closed in production; set `RECAPTCHA_OPTIONAL=true` for local dev only).
- Validates reCAPTCHA hostname against `ALLOWED_ORIGIN` and v3 action `contact_form`.
- Per-IP rate limit (default 5 requests / 15 minutes).
- Reads SMTP settings from environment variables.
- Sets `replyTo` to the submitter’s email so you can reply directly.

### Visitor analytics (Google Analytics 4)

- `src/lib/analytics.js` loads GA4 when `VITE_GA_MEASUREMENT_ID` is set.
- `PageViewTracker` in `App.jsx` records a page view on every route change.
- Production measurement ID: `G-7DW2Q54FRF` (GitHub variable).
- View traffic in [Google Analytics](https://analytics.google.com/) (not shown on the public site).

### Microsoft Teams live chat

- `src/components/chat/TeamsLiveChat.jsx` loads Microsoft Customer Connect script site-wide via `SiteLayout.jsx`.
- Chat bubble appears bottom-right; conversations route to your Microsoft Teams channel.
- Configuration is in code (not env vars):

| Attribute | Value |
|-----------|--------|
| Script | `https://res.public.onecdn.static.microsoft/customerconnect/v1/7dttl/init.js` |
| `environmentId` | `b2e5815c-388f-e355-b74d-34ea7937fe1d` |
| `region` | `unitedstates` |

To change chat settings, edit `TeamsLiveChat.jsx` or obtain a new embed snippet from Microsoft Teams Admin / Customer Connect.

### UI: reCAPTCHA badge vs Teams chat

Both widgets default to the bottom-right corner. **`src/index.css`** moves the Google reCAPTCHA v3 badge to the **bottom-left** on Contact/Get Quote pages so it does not overlap the Teams chat bubble. Required disclosure text remains in the contact form consent area.

## Repository layout

```
saba-shield-pro/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── ContactForm.jsx
│   │   │   └── RecaptchaNotice.jsx
│   │   ├── analytics/PageViewTracker.jsx
│   │   ├── chat/TeamsLiveChat.jsx
│   │   └── layout/SiteLayout.jsx
│   └── lib/
│       ├── phone.js
│       └── analytics.js
├── api/
│   ├── src/functions/contact.js
│   ├── src/lib/
│   │   ├── recaptcha.js
│   │   └── rateLimit.js
│   ├── src/index.js
│   ├── host.json
│   └── package.json
├── .github/workflows/
│   ├── main_sabatino.yml
│   └── main_sabatino-contact-api.yml
├── staticwebapp.config.json
├── .env.example
└── docs/
    ├── ARCHITECTURE_AND_DEPLOYMENT.md
    └── AI_SESSION_CONTEXT.md
```

## Azure resources

### Web App: `sabatino`

| Setting | Value |
|---------|--------|
| OS | Linux |
| Runtime | Node 24 LTS |
| Custom domains | `www.sabatino-ins.com`, `sabatino-ins.com` |
| Startup command | `npx -y serve -s /home/site/wwwroot -l $PORT --no-clipboard` |

Serves static files from `dist/` after GitHub Actions build.

### Function App: `sabatino-contact-api`

| Setting | Value |
|---------|--------|
| Plan | Flex Consumption |
| OS | Linux |
| Runtime | Node 24 |
| Region | Canada Central |
| Default URL | `https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net` |

#### App settings (Environment variables)

| Name | Purpose |
|------|---------|
| `SMTP_HOST` | `mail.smtp2go.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SMTP2GO username |
| `SMTP_PASSWORD` | SMTP2GO password |
| `MAIL_FROM` | Verified sender in SMTP2GO (must be allowed to send) |
| `MAIL_TO` | Inbox that receives inquiries (`info@sabatino-ins.com`) |
| `ALLOWED_ORIGIN` | Comma-separated origins for **code-level** CORS on POST responses |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 **secret** key (server-side verification) |
| `RECAPTCHA_MIN_SCORE` | Optional v3 score threshold (default `0.5`) |
| `RECAPTCHA_OPTIONAL` | Set `true` **local dev only** — skips CAPTCHA when secret missing |
| `RATE_LIMIT_MAX` | Optional max submissions per IP (default `5`) |
| `RATE_LIMIT_WINDOW_MS` | Optional rate limit window (default `900000` = 15 min) |

Example `ALLOWED_ORIGIN`:

```
https://www.sabatino-ins.com,https://sabatino-ins.com
```

#### CORS (Portal — required for browser forms)

**Function App → API → CORS → Allowed Origins**

Add both:

- `https://www.sabatino-ins.com`
- `https://sabatino-ins.com`

See [CORS section](#cors-why-two-layers-and-why-portal-matters) below.

## GitHub Actions

Two workflows deploy independently. Both use **OIDC** (no publish profile): Azure Deployment Center created app-specific secrets when you connected the repo.

### Website: `main_sabatino.yml`

**Triggers:** every push to `main`

1. `npm ci` → `npm run build` with `VITE_CONTACT_API_URL`, `VITE_RECAPTCHA_SITE_KEY`, `VITE_GA_MEASUREMENT_ID` from repo **Variables**
2. Copy `staticwebapp.config.json` into `dist/`
3. Deploy `dist/` to Web App `sabatino`

### Contact API: `main_sabatino-contact-api.yml`

**Triggers:** push to `main` when `api/**` or this workflow file changes (or manual `workflow_dispatch`)

1. `cd api` → `npm ci --omit=dev`
2. Zip contents of `api/` (not the whole repo)
3. Deploy zip to Function App `sabatino-contact-api`

**Important:** `AZURE_FUNCTIONAPP_PACKAGE_PATH` must be `api`. Azure’s generated template defaulted to `.` (repo root), which would deploy the React app instead of the function.

## GitHub configuration

### Variables (Settings → Secrets and variables → Actions → Variables)

| Name | Value |
|------|--------|
| `VITE_CONTACT_API_URL` | `https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact` |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 **site** key (public) |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID (`G-7DW2Q54FRF`) |

Vite inlines these at build time. If you change any value, update the variable and **re-run the website workflow** so `dist/` is rebuilt.

### Secrets

Created automatically by Azure Deployment Center (names include a hash suffix):

- **Website deploy:** `AZUREAPPSERVICE_CLIENTID_*`, `TENANTID_*`, `SUBSCRIPTIONID_*` (for `sabatino`)
- **Function deploy:** separate `AZUREAPPSERVICE_CLIENTID_*`, etc. (for `sabatino-contact-api`)

Do not reuse the website service principal for the function app — they are tied to different resources and subscriptions/identities.

## CORS: why two layers, and why Portal matters

CORS only affects **browsers**. Tools like `curl` or Postman are not subject to CORS, which is why the API could “work” in tests while the live form showed **Load failed**.

### Layer 1 — Code (`api/src/functions/contact.js`)

On successful `POST`, the function adds headers when `Origin` matches `ALLOWED_ORIGIN`:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### Layer 2 — Azure Portal CORS (required for preflight)

Before a cross-origin `POST`, the browser sends `OPTIONS` with `Origin` and `Access-Control-Request-Method`.

On Azure Functions (especially Linux / Flex Consumption), the **host intercepts** that preflight when both headers are present. It returns `204` **before** your function code runs. If Portal CORS does not list your site, the preflight has no `Access-Control-Allow-Origin` and the browser blocks the request.

That is why:

- `curl -X POST` with `Origin` → **200** and email sent
- Form in Safari/Chrome → **Load failed** until Portal CORS was configured

**Takeaway:** For browser clients, configure **both** `ALLOWED_ORIGIN` in app settings **and** allowed origins in **Function App → API → CORS**.

## Issues encountered during setup

### 1. Base44 backend removed

The site originally used Base44 for assets and backend. We removed the SDK, self-hosted images under `public/images/`, and added a local auth stub.

### 2. Function API returned 404

**Cause:** The function was never deployed; only code existed in the repo.

**Fix:** Connect GitHub Deployment Center to `sabatino-contact-api` and fix the workflow to deploy from `api/`.

### 3. Wrong package path in Azure-generated workflow

**Cause:** Deployment Center generated `AZURE_FUNCTIONAPP_PACKAGE_PATH: '.'`, zipping the repo root (React app).

**Symptom:** Deploy “succeeded” but `/api/contact` still 404 or wrong app content.

**Fix:** Set path to `api`, zip from inside `api/`, deploy with `package: '.'` after unzip.

### 4. Failed deploy with publish profile (401)

**Cause:** `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` was invalid or expired.

**Fix:** Use Deployment Center **Add a workflow** with user-assigned identity (OIDC) instead of publish profile.

### 5. Failed deploy reusing website OIDC secrets

**Cause:** Manual `azure-function.yml` used Web App `sabatino` service principal secrets.

**Symptom:** “Resource sabatino-contact-api doesn't exist” (wrong subscription or no access).

**Fix:** Let Deployment Center create **function-specific** secrets; removed duplicate `azure-function.yml`.

### 6. Form “Load failed” despite API working

**Cause:** Missing Portal CORS for `www.sabatino-ins.com` / `sabatino-ins.com`.

**Symptom:** Test emails from `curl` arrived; browser form failed.

**Fix:** Add both origins in **Function App → API → CORS**.

### 7. Three “Test / test@example.com” emails

**Cause:** Automated `curl` checks after deploy (not user submissions).

**Not a bug** — expected during verification.

### 8. reCAPTCHA “Invalid key type” on form

**Cause:** Google keys were **v3** but the site used a **v2 checkbox** widget.

**Fix:** Switched to `react-google-recaptcha-v3` (invisible verification on submit).

### 9. reCAPTCHA badge overlapping Teams chat

**Cause:** Both widgets default to bottom-right corner.

**Fix:** CSS in `src/index.css` moves reCAPTCHA badge to bottom-left.

## Local development

### Website only

```bash
npm install
npm run dev
```

### Website + local function

```bash
# Terminal 1 — API
cp api/local.settings.json.example api/local.settings.json
# Edit SMTP values in local.settings.json
cd api && npm install && npm start

# Terminal 2 — site
cp .env.example .env.local   # if present; set VITE_CONTACT_API_URL=http://localhost:7071/api/contact
npm run dev
```

Default local function URL: `http://localhost:7071/api/contact`

## reCAPTCHA setup (bot protection)

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → **Create**.
2. Choose **reCAPTCHA v3** (Score based).
3. Domains: `www.sabatino-ins.com`, `sabatino-ins.com`, `localhost` (for local dev).
4. Copy keys:
   - **Site key** → GitHub variable `VITE_RECAPTCHA_SITE_KEY` (rebuild website)
   - **Secret key** → Function App setting `RECAPTCHA_SECRET_KEY` (no redeploy needed)
5. Redeploy the website workflow after adding the site key.

reCAPTCHA v3 runs **invisibly** when the user clicks Send Message — there is no checkbox. A **Security verification** notice appears on the form; the small Google badge shows bottom-left (not bottom-right, to avoid overlapping Teams chat). Backend rejects submissions when verification fails.

## Google Analytics setup (visitor counts)

1. Go to [Google Analytics](https://analytics.google.com/) → create a **GA4** property for `sabatino-ins.com`.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Add GitHub variable `VITE_GA_MEASUREMENT_ID` with that ID.
4. Re-run the website workflow to rebuild `dist/`.
5. Open GA4 → **Reports → Realtime** to see live visitors; **Reports → Acquisition** for traffic over time.

Analytics runs in the background — there is no public visitor counter on the site. Use the GA4 dashboard for counts, pages, and geography.

## Making changes

| Change | What to do |
|--------|------------|
| Edit page copy / styling | Change `src/`, push to `main` → website workflow runs |
| Edit contact API logic | Change `api/`, push to `main` → function workflow runs |
| Change API URL | Update `VITE_CONTACT_API_URL` variable, re-run website workflow |
| New public domain | Add custom domain on Web App **and** add origin to Function CORS + `ALLOWED_ORIGIN` |
| SMTP / recipient | Update Function App environment variables (no redeploy needed for env-only changes) |
| Enable CAPTCHA | Set `VITE_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`, redeploy website |
| Enable analytics | Set `VITE_GA_MEASUREMENT_ID`, redeploy website |
| Change Teams chat | Edit `src/components/chat/TeamsLiveChat.jsx` |

## Troubleshooting

### Form shows “Contact form is not configured yet”

`VITE_CONTACT_API_URL` was empty at build time. Set the GitHub variable and redeploy the website.

### Form shows “Load failed” (Safari) or CORS error (Chrome)

1. Confirm Portal CORS includes your exact origin (`https://www...` vs `https://...` without www).
2. Confirm `ALLOWED_ORIGIN` app setting matches.
3. Hard-refresh the page or clear cache after redeploy.

### API returns 404

Function not deployed or wrong folder deployed. Check latest `main_sabatino-contact-api.yml` run on GitHub Actions and verify `api/` path in workflow.

### API returns 500

Check **Function App → Log stream** or Application Insights. Common causes:

- Wrong `SMTP_USER` / `SMTP_PASSWORD`
- `MAIL_FROM` not verified in SMTP2GO
- SMTP2GO blocking or rate limiting

### curl works, browser does not

Almost always **CORS** (Portal origins missing). See [CORS section](#cors-why-two-layers-and-why-portal-matters).

### API returns 429

Rate limit exceeded (default 5 submissions per IP per 15 minutes). Wait and retry.

### CAPTCHA verification failed

- Confirm `RECAPTCHA_SECRET_KEY` in Azure matches the site key’s reCAPTCHA v3 entry
- Do **not** set `RECAPTCHA_OPTIONAL=true` in production Azure
- Token must come from production hostname (`www.sabatino-ins.com` or `sabatino-ins.com`)

### Quick API test (no browser CORS)

```bash
curl -X POST "https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","message":"Hello","smsConsent":true}'
```

Expected without CAPTCHA token (production): `400` with CAPTCHA error. With valid browser submission, `{ "ok": true }` and email to `MAIL_TO`.

## Security notes

- SMTP credentials exist only in Azure Function settings and local `local.settings.json` (gitignored).
- API is `authLevel: anonymous` — intended for public contact forms.
- **reCAPTCHA v3:** fail-closed when secret missing in production; hostname + action + score validation in `api/src/lib/recaptcha.js`.
- **Rate limiting:** per-IP in `api/src/lib/rateLimit.js` (best-effort on serverless; consider Azure Front Door for heavy traffic).
- **Honeypot:** `_gotcha` field rejects basic bots.
- **Email headers:** subject fields sanitized to prevent header injection.
- `smsConsent` is required and stored in the email body for compliance visibility.
- Teams chat script loads from Microsoft CDN only; `environmentId` is public (not a secret).

## Related files

- Frontend form: `src/components/shared/ContactForm.jsx`
- reCAPTCHA notice: `src/components/shared/RecaptchaNotice.jsx`
- Phone formatter: `src/lib/phone.js`
- Analytics: `src/lib/analytics.js`, `src/components/analytics/PageViewTracker.jsx`
- Teams live chat: `src/components/chat/TeamsLiveChat.jsx`
- API handler: `api/src/functions/contact.js`
- reCAPTCHA verify: `api/src/lib/recaptcha.js`
- Rate limit: `api/src/lib/rateLimit.js`
- Badge/chat CSS: `src/index.css`
- Website workflow: `.github/workflows/main_sabatino.yml`
- Function workflow: `.github/workflows/main_sabatino-contact-api.yml`
- AI quick reference: [AI_SESSION_CONTEXT.md](./AI_SESSION_CONTEXT.md)
- Site README: [README.md](../README.md)
