# Automation Training

Playwright end-to-end test project using the **Page Object Model (POM)**. Tests target [playwright.dev](https://playwright.dev).

## Requirements

- Node.js (LTS recommended)
- macOS **14+** for the latest Playwright, **or** stay on Playwright `1.61.1` if you are on macOS 13

This repo is pinned to `@playwright/test@1.61.1` so Chromium works on macOS 13 (Ventura). WebKit is not supported on macOS 13 with this setup.

## Setup

```bash
npm install
npx playwright install chromium
```

On macOS 13, do **not** run `npx playwright install` alone — it tries to install WebKit and fails. Install only the browsers you need:

```bash
npx playwright install chromium
# optional
npx playwright install firefox
```

## Project structure

```
├── data/                  # Test data (JSON)
│   └── applicationData.json
├── pages/                 # Page Object Model classes
│   ├── HomePage.ts
│   └── DocsPage.ts
├── utilities/             # Shared helpers for tests & pages
│   ├── randomData.ts
│   ├── jsonData.ts
│   ├── pageHelpers.ts
│   ├── screenshot.ts
│   └── index.ts
├── tests/                 # Spec files (flows only)
│   └── example.spec.ts
├── playwright.config.ts   # Playwright config (baseURL, browsers, reporters)
└── .github/
    ├── CODEOWNERS                  # Default reviewers by path
    ├── PULL_REQUEST_TEMPLATE.md    # PR description template
    └── workflows/                  # CI + overnight build
```

### Page Object Model

- **Pages** hold locators and page actions (`goto`, clicks, assertions).
- **Tests** call page methods and stay free of raw selectors.
- **Data** lives under `data/` so expected values are not hard-coded in specs.
- **Utilities** hold reusable helpers (random data, JSON loading, page helpers, screenshots).

### Using utilities

```ts
import {
  randomEmail,
  uniqueId,
  loadTestData,
  clearAndFill,
  waitForUrlContains,
  takeScreenshot,
} from '../utilities';

const email = randomEmail('trainee');
const data = loadTestData<{ title: string }>('applicationData.json');
await clearAndFill(page.getByLabel('Email'), email);
await waitForUrlContains(page, '/docs');
await takeScreenshot(page, 'after-login.png');
```

## Run tests

```bash
# All tests
npx playwright test

# Headed mode
npx playwright test --headed

# UI mode
npx playwright test --ui

# Specific file
npx playwright test tests/example.spec.ts

# HTML report (after a run)
npx playwright show-report
```

## Configuration notes

| Setting | Value |
|--------|--------|
| Base URL | `https://playwright.dev` |
| Browser (local) | Chromium |
| Workers | `1` |
| Reporter | HTML |

Edit browsers and shared options in `playwright.config.ts`.

## CI

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `.github/workflows/playwright.yml` | Push / PR to `main` or `master` | Continuous verification on every change |
| `.github/workflows/overnight-build.yml` | Cron (`0 2 * * *` UTC) + manual (`workflow_dispatch`) | Nightly full test run; uploads HTML report and test-results artifacts |

Both workflows install dependencies and Playwright browsers, run `npx playwright test`, and upload the HTML report.

### Code owners & pull requests

- **CODEOWNERS** (`.github/CODEOWNERS`) auto-requests review from `@gits5213` for matching paths (tests, pages, utilities, CI, etc.).
- **PR template** (`.github/PULL_REQUEST_TEMPLATE.md`) is applied when you open a pull request.

To enable required reviews from code owners, turn on **Require review from Code Owners** in the branch protection rules for `main`/`master`.

## Useful links

- [Playwright docs](https://playwright.dev/docs/intro)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best practices](https://playwright.dev/docs/best-practices)
