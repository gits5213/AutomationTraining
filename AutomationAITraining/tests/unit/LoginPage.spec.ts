import assert from 'assert';
import { LoginPage } from '../../pages/LoginPage';

function createLocatorStub(label: string, tracker: string[]) {
  return {
    clear: async () => {
      tracker.push(`${label}:clear`);
    },
    fill: async (value: string) => {
      tracker.push(`${label}:fill:${value}`);
    },
    click: async () => {
      tracker.push(`${label}:click`);
    },
    waitFor: async () => {
      tracker.push(`${label}:wait`);
    },
  };
}

function createPageStub(tracker: string[]) {
  const username = createLocatorStub('username', tracker);
  const password = createLocatorStub('password', tracker);
  const login = createLocatorStub('login', tracker);
  const heading = createLocatorStub('heading', tracker);
  const remember = createLocatorStub('remember', tracker);

  const page = {
    goto: async (url: string) => {
      tracker.push(`goto:${url}`);
    },
    waitForLoadState: async (state: string) => {
      tracker.push(`load:${state}`);
    },
    waitForURL: async (urlOrRegExp: RegExp | string) => {
      tracker.push(`waitForURL:${String(urlOrRegExp)}`);
    },
    getByRole: (role: string, options?: { name?: string }) => {
      if (role === 'textbox' && options?.name === 'Enter your username') {
        return username;
      }
      if (role === 'link' && options?.name === 'Sign in') {
        return login;
      }
      if (role === 'heading' && options?.name === 'Login Form') {
        return heading;
      }
      if (role === 'checkbox' && options?.name === 'Remember Me') {
        return remember;
      }
      throw new Error(`Unexpected getByRole(${role}, ${JSON.stringify(options)})`);
    },
    getByPlaceholder: (placeholder: string) => {
      if (placeholder === 'Enter your password') {
        return password;
      }
      throw new Error(`Unexpected getByPlaceholder(${placeholder})`);
    },
  };

  return { page, username, password, login, heading, remember };
}

describe('pages/LoginPage', () => {
  it('wires accessibility-first locators and supports open + field actions', async () => {
    const tracker: string[] = [];
    const { page } = createPageStub(tracker);
    const loginPage = new LoginPage(page as never);

    assert.ok(loginPage.usernameInput);
    assert.ok(loginPage.passwordInput);
    assert.ok(loginPage.loginButton);
    assert.ok(loginPage.loginHeading);
    assert.ok(loginPage.rememberMeCheckbox);

    await loginPage.open('/');
    await loginPage.enterUsername('test');
    await loginPage.enterPassword('test');
    await loginPage.clickLogin();

    assert.ok(tracker.includes('goto:/'));
    assert.ok(tracker.includes('load:domcontentloaded'));
    assert.ok(tracker.includes('username:wait'));
    assert.ok(tracker.includes('username:clear'));
    assert.ok(tracker.includes('username:fill:test'));
    assert.ok(tracker.includes('password:fill:test'));
    assert.ok(tracker.includes('login:click'));
  });

  it('login() composes username, password, and click', async () => {
    const tracker: string[] = [];
    const { page } = createPageStub(tracker);
    const loginPage = new LoginPage(page as never);

    await loginPage.login('user1', 'pass1');
    assert.ok(tracker.includes('username:fill:user1'));
    assert.ok(tracker.includes('password:fill:pass1'));
    assert.ok(tracker.includes('login:click'));
  });

  it('expectLoginFormVisible and expectRedirectedToApp validate state', async () => {
    const tracker: string[] = [];
    const { page } = createPageStub(tracker);
    const loginPage = new LoginPage(page as never);

    await loginPage.expectLoginFormVisible();
    await loginPage.expectRedirectedToApp('app.html');

    assert.ok(tracker.includes('heading:wait'));
    assert.ok(tracker.includes('username:wait'));
    assert.ok(tracker.includes('password:wait'));
    assert.ok(tracker.includes('login:wait'));
    assert.ok(tracker.some((entry) => entry.startsWith('waitForURL:')));
  });

  it('open() defaults to root path', async () => {
    const tracker: string[] = [];
    const { page } = createPageStub(tracker);
    const loginPage = new LoginPage(page as never);
    await loginPage.open();
    assert.ok(tracker.includes('goto:/'));
  });
});
