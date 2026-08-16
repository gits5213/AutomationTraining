import { type Locator, type Page, expect } from '@playwright/test';
import { DocsPage } from './DocsPage';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async clickGetStarted(): Promise<DocsPage> {
    await this.getStartedLink.click();
    return new DocsPage(this.page);
  }
}
