Act as a Senior QA Automation Architect.

I want to build a professional, scalable, maintainable, and reusable UI Automation Framework using the following requirements.

Project Goal:
Create a complete Playwright TypeScript automation framework from scratch based on industry best practices. The framework must support Page Object Model, Data-Driven Testing, Keyword-Driven Utility functions, Allure Reporting, Playwright MCP Server project-level configuration, and CI/CD nightly execution.

Application Under Test:
URL: https://demo.applitools.com/

Test Scenario:
1. Navigate to https://demo.applitools.com/
2. Enter username: test
3. Enter password: test
4. Click the Login button
5. Verify that the redirected URL contains: app.html

Technology Stack:
- Playwright latest version
- TypeScript
- Node.js
- Allure Report
- Playwright MCP Server
- GitHub Actions
- Azure DevOps Pipeline

Framework Design Requirements:

1. Page Object Model:
Create a Page Object Model structure.
Required page class:
- pages/LoginPage.ts

Each page class should include:
- Locators
- Page actions
- Page-specific validations
- Reusable methods

2. Data-Driven Testing:
Create a data folder and include the following files:
- data/applicationData.json
- data/userData.json
- data/globalData.json

Use these files to store:
- Application URL
- Test credentials
- Expected URL values
- Environment name
- Timeout values
- Browser/project-level reusable data

3. Keyword-Driven Utility Layer:
Create a reusable utility file:
- utilities/utils.ts

Include generic reusable keyword functions such as:
- navigateToUrl()
- enterText()
- clickElement()
- verifyUrlContains()
- waitForElement()
- takeScreenshot()
- randomEmailWithDynamicLenght()
- randomFirstnameWithDynamicLenght()
- randomLastnameWithDynamicLenght()
- randomMixNumericAlphanetWithDynamicLenght()
- waitForState()
- waitForeElementState()

4. Test Specification:
Create a Playwright test spec file:
- tests/login.spec.ts

The test spec must include:
- test.describe()
- test.beforeAll()
- test.afterAll()
- test()
- Use Page Object Model
- Use data from JSON files
- Use utility methods
- Validate that the URL contains app.html after login
- Apply tags on the test 
- Use proper tags such as:
  - @smoke
  - @regression
  - @sanity
  - @e2e

5. Playwright Configuration:
Configure playwright.config.ts with:
- 1 worker only
- 1 project only
- Chromium browser only
- Base URL support
- Allure reporter
- Screenshot on failure
- Video on failure
- Trace on failure

6. Playwright MCP Server Configuration:
- Configure Playwright MCP Server at the project level.
- Playwright MCP Server:
- Use Playwright MCP Server to inspect the application page.
- Identify stable locators using this priority:
  1. getByRole()
  2. getByLabel()
  3. getByPlaceholder()
  4. getByText()
  5. getByTestId()
  6. CSS/XPath only if no better locator is available
- Do not guess locators.
- Prefer accessibility-based locators.

Create:
- .vscode/mcp.json

Use a valid project-level MCP server configuration.
Like 
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--browser=chrome",
        "--viewport-size=1440x900"
      ]
    }
  }
}

7. Environment Configuration:
Create:
- .env
- .env.example

The .env file should support:
- BASE_URL=https://demo.applitools.com/
- USERNAME=test
- PASSWORD=test
- ENV=qa

8. Package.json Scripts:
Update package.json with scripts for:
- Cleaning previous test artifacts before execution
- Running Playwright tests
- Generating Allure report automatically after test execution
- Opening Allure report
- Running tests in headed mode
- Running tests in Chromium only
- Running tests in UI mode
- Running tests in debug mode
- Running tests in codegen mode

Required script behavior:
- pretest should clean old report folders
- test should run Playwright tests
- posttest should generate the Allure report

9. CI/CD Configuration:
Create a PR Template file
Create a CODEOWNER file 
Create nightly build configuration for both:

GitHub Actions:
- .github/workflows/nightly-build.yml

Azure DevOps:
- azure-pipelines.yml

Both pipelines should:
- Run nightly
- Install dependencies
- Install Playwright browsers
- Run Playwright tests
- Generate Allure results
- Publish test artifacts/reports where applicable
- Publish test artifacts/reports in a github page

10. Standard Project Files:
Create:
- README.md
- .gitignore
- tsconfig.json

README.md should include:
- Project overview
- Tech stack
- Folder structure
- Installation steps
- How to run tests
- How to generate/open Allure report
- How to use Playwright MCP Server
- CI/CD execution details
- How to set up github page

.gitignore should exclude:
- node_modules
- .env
- test-results
- playwright-report
- allure-results
- allure-report
- dist
- logs

Expected Project Structure:

project-root/
  .github/
    workflows/
      nightly-build.yml
    CODEOWNERS
    PULL_REQUEST_TEMPLATE.md

  .vscode/
    mcp.json

  data/
    applicationData.json
    userData.json
    globalData.json

  pages/
    LoginPage.ts

  tests/
    login.spec.ts

  utilities/
    utils.ts

  .env
  .env.example
  .gitignore
  README.md
  azure-pipelines.yml
  package.json
  playwright.config.ts
  tsconfig.json

Coding Standards:
- Use clean TypeScript
- Use meaningful class names and method names
- Avoid hardcoded values inside test specs
- Keep selectors inside page classes
- Keep test data inside JSON files or environment files
- Keep reusable actions inside utility files
- Follow reusability, maintainability, and scalability principles
- Add comments only where helpful
- Make the code production-ready

Test Coverage:
- Test coverage should be 100%
- Produce a genuine Istanbul coverage report for this framework's

Final Output Requirement:
Generate the complete framework with all required files, folder structure, and code for the login scenario.