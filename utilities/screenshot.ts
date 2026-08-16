import { type Page } from '@playwright/test';
import path from 'path';

/**
 * Saves a screenshot under test-results/screenshots/.
 * File name defaults to a timestamp if not provided.
 */
export async function takeScreenshot(page: Page, name?: string) {
  const fileName = name ?? `screenshot_${Date.now()}.png`;
  const filePath = path.resolve('test-results', 'screenshots', fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}
