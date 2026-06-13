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
