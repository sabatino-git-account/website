# Changelog

All notable changes to this project are documented here.

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
GitHub (source code)
    │
    ▼ push to main
GitHub Actions (main_sabatino.yml)
    │  npm ci → npm run build → dist/
    ▼
Azure Web App (sabatino)
    │  serve static files + SPA routing
    ▼
Public website (e.g. sabatino.azurewebsites.net)
```

### Future work
- [ ] Implement real auth in `src/api/auth.js` and wire `AuthContext.jsx`
- [ ] Route login/register pages when auth backend is ready
- [ ] Self-host images (move off `media.base44.com`)
- [ ] Connect contact form to email/API backend
- [ ] Add custom domain + HTTPS in Azure
