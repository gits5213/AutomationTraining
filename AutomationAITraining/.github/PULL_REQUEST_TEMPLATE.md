## Summary

<!-- What does this PR change and why? -->

-

## Type of change

- [ ] New test(s)
- [ ] Page object / utility update
- [ ] Test data update
- [ ] CI / tooling / config
- [ ] Bug fix
- [ ] Documentation

## Test plan

<!-- How was this verified? Check all that apply. -->

- [ ] `npm test` passes locally
- [ ] Targeted specs only: `npx playwright test <path>`
- [ ] Tagged run: `npx playwright test --grep @smoke`
- [ ] Allure report reviewed (`npm run allure:open`)
- [ ] Unit coverage: `npm run test:coverage` (100%)
- [ ] Nightly build green (if applicable)

## Screenshots / evidence

<!-- Optional: attach screenshots, traces, or Allure notes for UI or flaky-test fixes. -->

## Checklist

- [ ] Specs stay free of raw selectors (use page objects)
- [ ] Shared data lives under `data/` or `.env`
- [ ] No `test.only` / `test.skip` left behind unintentionally
- [ ] CODEOWNERS / reviewers notified as needed
