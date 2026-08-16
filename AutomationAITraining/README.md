# AutomationAITraining

Professional Playwright TypeScript UI automation framework for [https://demo.applitools.com/](https://demo.applitools.com/).

Built with Page Object Model, data-driven JSON fixtures, keyword-driven utilities, Allure reporting, Playwright MCP Server configuration, Istanbul coverage, and a nightly GitHub Actions build that publishes reports to GitHub Pages.

## Tech stack

- Playwright `1.61.1` (Chromium) — pinned for macOS 13 compatibility; Chromium-only project
- TypeScript + Node.js
- Allure Report (`allure-playwright` + `allure-commandline`)
- Playwright MCP Server (`.vscode/mcp.json`)
- GitHub Actions nightly pipeline + Azure Pipelines schedule
- Istanbul coverage via `nyc` + Mocha unit tests

## Folder structure

```
project-root/
  .github/
    workflows/
      nightly-build.yml
    CODEOWNERS
    PULL_REQUEST_TEMPLATE.md
  .vscode/
    mcp.json
  data/
    applicationData.json
    userData.json
    globalData.json
  pages/
    LoginPage.ts
  tests/
    login.spec.ts
    unit/
      utils.spec.ts
      LoginPage.spec.ts
  utilities/
    utils.ts
  .env
  .env.example
  .gitignore
  README.md
  azure-pipelines.yml
  package.json
  playwright.config.ts
  tsconfig.json
```

## Installation

```bash
cp .env.example .env
npm install
npx playwright install chromium
```

On macOS 13, install **Chromium only** (this project does not use Firefox/WebKit).

## How to run tests

```bash
# Clean artifacts, run Playwright, then generate Allure (pretest/test/posttest)
npm test

# Headed
npm run test:headed

# Chromium project only
npm run test:chromium

# UI mode
npm run test:ui

# Debug mode
npm run test:debug

# Codegen
npm run codegen

# Tag filters
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

## Allure report

```bash
# Generated automatically by npm posttest after npm test
npm run allure:generate

# Open the generated report
npm run allure:open

# Or serve results directly
npm run allure:serve
```

## Istanbul coverage (framework source)

Unit tests cover `utilities/` and `pages/` with a genuine Istanbul (`nyc`) report:

```bash
npm run test:coverage
```

HTML output: `coverage/index.html` (enforced at **100%** lines/functions/branches/statements).

## Playwright MCP Server

Project-level MCP config lives in `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--browser=chrome",
        "--viewport-size=1440x900"
      ]
    }
  }
}
```

Use the Playwright MCP tools in Cursor to inspect the app and prefer locators in this order:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. CSS/XPath only as a last resort

Login locators used in this framework (inspected from the live page):

- Username: `getByRole('textbox', { name: 'Enter your username' })`
- Password: `getByPlaceholder('Enter your password')`
- Sign in: `getByRole('link', { name: 'Sign in' })`

## CI/CD

### GitHub Actions — `.github/workflows/nightly-build.yml`

- Schedule: `0 2 * * *` UTC (plus `workflow_dispatch`)
- Installs dependencies and Playwright Chromium
- Runs `npm test` (clean → Playwright → Allure generate)
- Runs `npm run test:coverage`
- Uploads Allure, Playwright HTML, and coverage artifacts
- Publishes a combined report site to **GitHub Pages**

### Azure Pipelines — `azure-pipelines.yml`

- Nightly cron schedule
- Same install / test / coverage / artifact publish flow

### PR template & CODEOWNERS

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CODEOWNERS` (default owner `@gits5213` — update to your handle)

## How to set up GitHub Pages

1. Push this repository to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
3. Ensure the `github-pages` environment is allowed for Actions (created automatically on first deploy).
4. Run **Nightly Build** (manually or wait for the schedule).
5. Open the Pages URL from the workflow summary (or **Settings → Pages**).

Report index links:

- `/allure/` — Allure HTML report
- `/playwright/` — Playwright HTML report
- `/coverage/` — Istanbul coverage

## Environment variables

| Variable   | Example                         | Purpose        |
|-----------|----------------------------------|----------------|
| `BASE_URL` | `https://demo.applitools.com/` | App under test |
| `USERNAME` | `test`                           | Login user     |
| `PASSWORD` | `test`                           | Login password |
| `ENV`      | `qa`                             | Environment    |

## Login scenario

1. Navigate to `https://demo.applitools.com/`
2. Enter username `test`
3. Enter password `test`
4. Click **Sign in**
5. Verify URL contains `app.html`
