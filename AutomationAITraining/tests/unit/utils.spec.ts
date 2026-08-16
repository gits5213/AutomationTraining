import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  clickElement,
  enterText,
  loadJsonData,
  navigateToUrl,
  randomEmailWithDynamicLenght,
  randomFirstnameWithDynamicLenght,
  randomLastnameWithDynamicLenght,
  randomMixNumericAlphanetWithDynamicLenght,
  takeScreenshot,
  verifyUrlContains,
  waitForElement,
  waitForElementState,
  waitForeElementState,
  waitForState,
} from '../../utilities/utils';

type FakeLocator = {
  clear: () => Promise<void>;
  fill: (value: string) => Promise<void>;
  click: () => Promise<void>;
  waitFor: (options: { state: string; timeout?: number }) => Promise<void>;
};

type FakePage = {
  goto: (url: string) => Promise<void>;
  waitForLoadState: (state: string) => Promise<void>;
  waitForURL: (url: RegExp | string) => Promise<void>;
  screenshot: (options: { path: string; fullPage: boolean }) => Promise<Buffer>;
  url: () => string;
};

describe('utilities/utils keyword helpers', () => {
  it('loadJsonData reads application data', () => {
    const data = loadJsonData<{ baseUrl: string }>('applicationData.json');
    assert.ok(data.baseUrl.includes('applitools'));
  });

  it('navigateToUrl calls page.goto', async () => {
    const calls: string[] = [];
    const page = {
      goto: async (url: string) => {
        calls.push(url);
      },
    } as Pick<FakePage, 'goto'>;

    await navigateToUrl(page as never, 'https://example.com');
    assert.deepStrictEqual(calls, ['https://example.com']);
  });

  it('enterText clears and fills a locator', async () => {
    const actions: string[] = [];
    const locator: FakeLocator = {
      clear: async () => {
        actions.push('clear');
      },
      fill: async (value: string) => {
        actions.push(`fill:${value}`);
      },
      click: async () => undefined,
      waitFor: async () => undefined,
    };

    await enterText(locator as never, 'demo');
    assert.deepStrictEqual(actions, ['clear', 'fill:demo']);
  });

  it('clickElement clicks a locator', async () => {
    let clicked = false;
    const locator: FakeLocator = {
      clear: async () => undefined,
      fill: async () => undefined,
      click: async () => {
        clicked = true;
      },
      waitFor: async () => undefined,
    };

    await clickElement(locator as never);
    assert.strictEqual(clicked, true);
  });

  it('verifyUrlContains waits for a matching URL', async () => {
    const patterns: Array<RegExp | string> = [];
    const page: Pick<FakePage, 'waitForURL'> = {
      waitForURL: async (url) => {
        patterns.push(url);
      },
    };

    await verifyUrlContains(page as never, 'app.html');
    await verifyUrlContains(page as never, 'path.with+special(chars)');
    assert.strictEqual(patterns.length, 2);
    assert.ok((patterns[0] as RegExp).test('https://demo.applitools.com/app.html'));
    assert.ok((patterns[1] as RegExp).test('https://example.com/path.with+special(chars)'));
  });

  it('waitForElement waits for visible state', async () => {
    const states: string[] = [];
    const locator: FakeLocator = {
      clear: async () => undefined,
      fill: async () => undefined,
      click: async () => undefined,
      waitFor: async (options) => {
        states.push(options.state);
      },
    };

    await waitForElement(locator as never, 1000);
    assert.deepStrictEqual(states, ['visible']);
  });

  it('takeScreenshot creates directories and writes the file', async () => {
    const relativePath = 'test-results/screenshots/unit-shot.png';
    const absolutePath = path.resolve(process.cwd(), relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    const page: Pick<FakePage, 'screenshot'> = {
      screenshot: async ({ path: screenshotPath }) => {
        fs.writeFileSync(screenshotPath, Buffer.from('png'));
        return Buffer.from('png');
      },
    };

    const saved = await takeScreenshot(page as never, relativePath);
    assert.strictEqual(saved, absolutePath);
    assert.ok(fs.existsSync(absolutePath));

    const nestedPath = 'test-results/screenshots/nested-new/unit-shot-2.png';
    const nestedAbsolute = path.resolve(process.cwd(), nestedPath);
    if (fs.existsSync(path.dirname(nestedAbsolute))) {
      fs.rmSync(path.dirname(nestedAbsolute), { recursive: true, force: true });
    }

    const savedNested = await takeScreenshot(page as never, nestedPath);
    assert.strictEqual(savedNested, nestedAbsolute);
    assert.ok(fs.existsSync(nestedAbsolute));
  });

  it('random generators honor requested length', () => {
    assert.strictEqual(randomEmailWithDynamicLenght(12).split('@')[0].length, 12);
    assert.match(randomEmailWithDynamicLenght(5), /^[a-z]{5}@example\.com$/);
    assert.strictEqual(randomFirstnameWithDynamicLenght(7).length, 7);
    assert.match(randomFirstnameWithDynamicLenght(4), /^[A-Z][a-z]{3}$/);
    assert.strictEqual(randomLastnameWithDynamicLenght(9).length, 9);
    assert.strictEqual(randomMixNumericAlphanetWithDynamicLenght(15).length, 15);
    assert.match(randomMixNumericAlphanetWithDynamicLenght(8), /^[a-zA-Z0-9]{8}$/);
    assert.strictEqual(randomEmailWithDynamicLenght(0).split('@')[0].length, 1);
    assert.strictEqual(randomFirstnameWithDynamicLenght(0).length, 1);
    assert.strictEqual(randomLastnameWithDynamicLenght(0).length, 1);
    assert.strictEqual(randomMixNumericAlphanetWithDynamicLenght(0).length, 1);
    assert.strictEqual(randomEmailWithDynamicLenght().includes('@'), true);
    assert.ok(randomFirstnameWithDynamicLenght().length >= 1);
    assert.ok(randomLastnameWithDynamicLenght().length >= 1);
    assert.ok(randomMixNumericAlphanetWithDynamicLenght().length >= 1);
  });

  it('waitForState and element state helpers delegate correctly', async () => {
    const loadStates: string[] = [];
    const page: Pick<FakePage, 'waitForLoadState'> = {
      waitForLoadState: async (state: string) => {
        loadStates.push(state);
      },
    };

    await waitForState(page as never);
    await waitForState(page as never, 'networkidle');
    assert.deepStrictEqual(loadStates, ['load', 'networkidle']);

    const elementStates: Array<{ state: string; timeout?: number }> = [];
    const locator: FakeLocator = {
      clear: async () => undefined,
      fill: async () => undefined,
      click: async () => undefined,
      waitFor: async (options) => {
        elementStates.push(options);
      },
    };

    await waitForElementState(locator as never);
    await waitForElementState(locator as never, 'hidden', 500);
    await waitForeElementState(locator as never);
    await waitForeElementState(locator as never, 'attached', 250);
    assert.deepStrictEqual(elementStates, [
      { state: 'visible', timeout: undefined },
      { state: 'hidden', timeout: 500 },
      { state: 'visible', timeout: undefined },
      { state: 'attached', timeout: 250 },
    ]);
  });
});
