import { test } from '@playwright/test';
import applicationData from '../../data/applicationData.json';
import { HomePage } from '../../pages/HomePage';

test.describe('example', { tag: ['@e2e', '@regression'] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('has title', { tag: '@smoke' }, async () => {
    await homePage.expectTitle(applicationData.title);
  });

  test('get started link', async ({ page }) => {
    const docsPage = await homePage.clickGetStarted();
    await docsPage.expectInstallationVisible();
  });
});
