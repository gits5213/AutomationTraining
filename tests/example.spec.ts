import { test } from '@playwright/test';
import applicationData from '../data/applicationData.json';
import { HomePage } from '../pages/HomePage';

test.describe('example', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('has title', async () => {
    await homePage.expectTitle(applicationData.title);
  });

  test('get started link', async ({ page }) => {
    const docsPage = await homePage.clickGetStarted();
    await docsPage.expectInstallationVisible();
  });
});
