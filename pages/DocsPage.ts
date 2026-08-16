import { type Locator, type Page, expect } from '@playwright/test';

export class DocsPage {
  readonly page: Page;
  readonly installationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.installationHeading = page.getByRole('heading', { name: 'Installation' });
  }

  async expectInstallationVisible() {
    await expect(this.installationHeading).toBeVisible();
  }
}
