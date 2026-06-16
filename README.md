# Sabatino Insurance Agency Website

Marketing site for Sabatino/Mastrocola Insurance Agency — built with React, Vite, and Tailwind CSS.

See [CHANGELOG.md](./CHANGELOG.md) for a history of project changes.

## Prerequisites

- Node.js 24
- npm

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
```

Static files are output to `dist/`.

## Project structure

- `src/pages/` — page components (Home, About, Services, etc.)
- `src/components/` — shared UI and layout components
- `src/api/auth.js` — auth stub (replace when adding your own backend)

## Authentication

Auth is not wired up yet. Login/register pages exist but are not routed. When you add a backend (e.g. Azure AD B2C, Auth0, or a custom API), implement the methods in `src/api/auth.js` and connect `src/lib/AuthContext.jsx`.

## Contact form (SMTP2GO via Azure Functions)

Form submissions are sent by **`sabatino-contact-api`** (Azure Function). SMTP credentials stay in Azure only — never in the React app.

### Azure Function App environment variables

In **sabatino-contact-api → Environment variables → App settings**, confirm these exist:

| Name | Example |
|------|---------|
| `SMTP_HOST` | `mail.smtp2go.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your SMTP2GO username |
| `SMTP_PASSWORD` | your SMTP2GO password |
| `MAIL_FROM` | verified sender in SMTP2GO |
| `MAIL_TO` | `info@sabatino-ins.com` |
| `ALLOWED_ORIGIN` | `https://www.sabatino-ins.com,https://sabatino-ins.com` |

### GitHub (website build)

Add a repository **variable** (Settings → Secrets and variables → Actions → Variables):

- `VITE_CONTACT_API_URL` = `https://sabatino-contact-api-bza0cqhqbtd8fgcu.canadacentral-01.azurewebsites.net/api/contact`

### GitHub (function deploy)

Add a repository **secret**:

- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` — download from Function App → Overview → Get publish profile

### Local testing

```bash
cp api/local.settings.json.example api/local.settings.json
# edit SMTP values, then:
cd api && npm install && npm start
```

In another terminal, copy `.env.example` to `.env.local` and run `npm run dev`.

## Deployment

This is a static SPA. GitHub Actions builds the site and deploys the `dist/` folder to Azure.

### How deploy works

1. You push code to `main` on GitHub
2. GitHub Actions runs `.github/workflows/main_sabatino.yml`
3. The workflow builds the site with Node 24 (`npm ci` → `npm run build`)
4. Only the built files in `dist/` are uploaded to Azure Web App `sabatino`

Azure Deployment Center already created the workflow and GitHub secrets when you connected the repo. No publish profile is needed.

### Azure App Service settings

| Setting | Value |
|---------|--------|
| OS | Linux |
| Runtime stack | **Node 24 LTS** |
| Startup command | `npx -y serve -s /home/site/wwwroot -l $PORT --no-clipboard` |

The startup command serves your static files and handles SPA routing (`/about`, `/services`, etc.).

`staticwebapp.config.json` is copied into `dist/` during the build for routing fallback support.

### Custom domain (e.g. `www.sabatino-ins.com`)

No code changes are required. Configure DNS and Azure as follows.

**1. Azure Portal → Web App `sabatino` → Custom domains → Add custom domain**

- Enter: `www.sabatino-ins.com`
- Azure will show the DNS records you need to create

**2. At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)**

Add a **CNAME** record:

| Type | Name / Host | Value / Points to |
|------|-------------|-------------------|
| CNAME | `www` | `sabatino.azurewebsites.net` |

**3. Back in Azure → validate and add the domain**

Azure checks the CNAME, then attaches the domain to your Web App.

**4. Enable HTTPS (free)**

Azure Portal → Custom domains → **Add binding**
- Select `www.sabatino-ins.com`
- Choose **App Service Managed Certificate** (free)
- TLS/SSL type: **SNI SSL**

**5. Optional — redirect root domain to www**

If you also want `sabatino-ins.com` (without `www`) to work:

- Add `sabatino-ins.com` as a second custom domain in Azure, **or**
- At your registrar, set root (`@`) to forward/redirect to `https://www.sabatino-ins.com`

Root/apex domains (`sabatino-ins.com`) cannot use a simple CNAME on all registrars. Common options:
- **Redirect** `@` → `www` at the registrar (easiest)
- **ALIAS/ANAME** record pointing to `sabatino.azurewebsites.net` (Cloudflare, some DNS providers)
- **A record** to Azure App Service IP (shown in Azure Custom domains blade)

**6. Verify**

After DNS propagates (minutes to 48 hours):

```
https://www.sabatino-ins.com
```

should show your site. The `*.azurewebsites.net` URL will still work unless you disable it.

**No app rebuild needed** — the same `dist/` files are served on any domain you attach.
