import { type Locator, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type WaitState = 'attached' | 'detached' | 'visible' | 'hidden';
type LoadState = 'load' | 'domcontentloaded' | 'networkidle';

/** Loads a JSON data file from the project data/ folder. */
export function loadJsonData<T>(fileName: string): T {
  const filePath = path.resolve(process.cwd(), 'data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/** Navigates the page to the provided URL. */
export async function navigateToUrl(page: Page, url: string): Promise<void> {
  await page.goto(url);
}

/** Clears and enters text into a locator. */
export async function enterText(locator: Locator, text: string): Promise<void> {
  await locator.clear();
  await locator.fill(text);
}

/** Clicks an element. */
export async function clickElement(locator: Locator): Promise<void> {
  await locator.click();
}

/** Asserts that the current URL contains the expected fragment. */
export async function verifyUrlContains(page: Page, expectedFragment: string): Promise<void> {
  await page.waitForURL(new RegExp(escapeRegExp(expectedFragment)));
}

/** Waits until the element is visible (or for the provided timeout). */
export async function waitForElement(locator: Locator, timeout?: number): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

/** Captures a screenshot to the given relative path under the project root. */
export async function takeScreenshot(page: Page, fileName: string): Promise<string> {
  const screenshotPath = path.resolve(process.cwd(), fileName);
  const directory = path.dirname(screenshotPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

/** Generates a random email with a dynamic local-part length. */
export function randomEmailWithDynamicLenght(length = 8): string {
  const localPart = randomAlpha(Math.max(1, length));
  return `${localPart}@example.com`;
}

/** Generates a random first name with a dynamic length. */
export function randomFirstnameWithDynamicLenght(length = 6): string {
  return capitalize(randomAlpha(Math.max(1, length)));
}

/** Generates a random last name with a dynamic length. */
export function randomLastnameWithDynamicLenght(length = 8): string {
  return capitalize(randomAlpha(Math.max(1, length)));
}

/** Generates a mixed alphanumeric string with a dynamic length. */
export function randomMixNumericAlphanetWithDynamicLenght(length = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomFromCharset(chars, Math.max(1, length));
}

/** Waits for a page load state. */
export async function waitForState(page: Page, state: LoadState = 'load'): Promise<void> {
  await page.waitForLoadState(state);
}

/** Waits for an element to reach the given state. */
export async function waitForElementState(
  locator: Locator,
  state: WaitState = 'visible',
  timeout?: number,
): Promise<void> {
  await locator.waitFor({ state, timeout });
}

/**
 * Alias matching the framework keyword spelling from the design spec.
 * Prefer waitForElementState() in new code.
 */
export async function waitForeElementState(
  locator: Locator,
  state: WaitState = 'visible',
  timeout?: number,
): Promise<void> {
  await waitForElementState(locator, state, timeout);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function randomAlpha(length: number): string {
  return randomFromCharset('abcdefghijklmnopqrstuvwxyz', length);
}

function randomFromCharset(charset: string, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
