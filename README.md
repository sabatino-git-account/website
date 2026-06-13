# Sabatino Insurance Agency Website

Marketing site for Sabatino/Mastrocola Insurance Agency — built with React, Vite, and Tailwind CSS.

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

## Deployment

This is a static SPA. Deploy the `dist/` folder to Azure.

### Azure App Service (Web App)

| Setting | Value |
|---------|--------|
| OS | Linux |
| Runtime stack | **Node 24 LTS** |
| Startup command | `npx -y serve -s /home/site/wwwroot -l $PORT --no-clipboard` |

GitHub Actions workflow: `.github/workflows/azure-webapp.yml` (Node 24)

**Required GitHub secrets:**
- `AZURE_WEBAPP_NAME` — your Web App name
- `AZURE_WEBAPP_PUBLISH_PROFILE` — download from Azure Portal → Web App → Deployment Center → Manage publish profile

### Azure Static Web Apps

| Setting | Value |
|---------|--------|
| Build | Node 24 |
| App location | `/` |
| Output location | `dist` |

`staticwebapp.config.json` handles SPA routing fallback.
