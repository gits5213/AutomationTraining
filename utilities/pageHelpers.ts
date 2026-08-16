import { type Locator, type Page, expect } from '@playwright/test';

/** Clears an input and types a new value. */
export async function clearAndFill(locator: Locator, value: string) {
  await locator.clear();
  await locator.fill(value);
}

/** Waits until the URL contains the given path or fragment. */
export async function waitForUrlContains(page: Page, text: string) {
  await expect(page).toHaveURL(new RegExp(text));
}

/** Returns the current page path (pathname only). */
export async function getPathname(page: Page): Promise<string> {
  return page.evaluate(() => window.location.pathname);
}

/** Scrolls an element into view before interacting. */
export async function scrollIntoView(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
}
