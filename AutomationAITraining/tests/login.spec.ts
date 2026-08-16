import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
  loadJsonData,
  takeScreenshot,
  waitForState,
  randomEmailWithDynamicLenght,
} from '../utilities/utils';

type ApplicationData = {
  baseUrl: string;
  loginPath: string;
  expectedAppUrlFragment: string;
  applicationName: string;
};

type UserData = {
  validUser: {
    username: string;
    password: string;
  };
};

type GlobalData = {
  environment: string;
  timeouts: {
    element: number;
  };
};

const applicationData = loadJsonData<ApplicationData>('applicationData.json');
const userData = loadJsonData<UserData>('userData.json');
const globalData = loadJsonData<GlobalData>('globalData.json');

test.describe('Applitools Demo — Login @smoke @regression @sanity @e2e', () => {
  let loginPage: LoginPage;

  test.beforeAll(async () => {
    // Suite-level setup: confirm data packs loaded for the active environment.
    expect(applicationData.baseUrl).toBeTruthy();
    expect(userData.validUser.username).toBeTruthy();
    expect(globalData.environment).toBeTruthy();
  });

  test.afterAll(async () => {
    // Suite-level teardown hook (reserved for shared cleanup such as report metadata).
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open(applicationData.loginPath);
    await loginPage.expectLoginFormVisible();
  });

  test(
    'should login successfully and redirect to app.html @smoke @regression @sanity @e2e',
    {
      tag: ['@smoke', '@regression', '@sanity', '@e2e'],
    },
    async ({ page }) => {
      const username = process.env.USERNAME || userData.validUser.username;
      const password = process.env.PASSWORD || userData.validUser.password;

      // Keyword utilities remain available for data generation when extending flows.
      expect(randomEmailWithDynamicLenght(10)).toContain('@example.com');

      await loginPage.login(username, password);
      await waitForState(page, 'domcontentloaded');
      await loginPage.expectRedirectedToApp(applicationData.expectedAppUrlFragment);

      await takeScreenshot(page, 'test-results/screenshots/login-success.png');
      await expect(page).toHaveURL(new RegExp(applicationData.expectedAppUrlFragment));
    },
  );
});
