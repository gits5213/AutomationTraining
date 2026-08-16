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
└── .github/workflows/     # CI workflow
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

GitHub Actions (`.github/workflows/playwright.yml`) runs on push/PR to `main` or `master`: installs dependencies, browsers, runs tests, and uploads the HTML report artifact.

## Useful links

- [Playwright docs](https://playwright.dev/docs/intro)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best practices](https://playwright.dev/docs/best-practices)
