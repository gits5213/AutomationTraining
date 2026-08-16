import { type Locator, type Page } from '@playwright/test';
import {
  clickElement,
  enterText,
  navigateToUrl,
  verifyUrlContains,
  waitForElement,
  waitForState,
} from '../utilities/utils';

/**
 * Page Object for the Applitools demo login screen.
 * Locators were identified from the live app using accessibility-first selectors:
 * getByRole / getByPlaceholder (labels are not wired via for= attributes).
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Enter your username' });
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.loginButton = page.getByRole('link', { name: 'Sign in' });
    this.loginHeading = page.getByRole('heading', { name: 'Login Form' });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember Me' });
  }

  /** Opens the login page (relative to baseURL when path is `/`). */
  async open(url = '/'): Promise<void> {
    await navigateToUrl(this.page, url);
    await waitForState(this.page, 'domcontentloaded');
    await waitForElement(this.usernameInput);
  }

  async enterUsername(username: string): Promise<void> {
    await enterText(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await enterText(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await clickElement(this.loginButton);
  }

  /** Performs a complete login using the provided credentials. */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async expectLoginFormVisible(): Promise<void> {
    await waitForElement(this.loginHeading);
    await waitForElement(this.usernameInput);
    await waitForElement(this.passwordInput);
    await waitForElement(this.loginButton);
  }

  async expectRedirectedToApp(expectedUrlFragment: string): Promise<void> {
    await verifyUrlContains(this.page, expectedUrlFragment);
  }
}
