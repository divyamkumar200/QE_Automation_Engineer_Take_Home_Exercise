# QE Automation Engineer - E-commerce Web Automation

## Scope

This repository implements a small TypeScript + Playwright solution for the supplied take-home exercise.

Covered scenarios:
1. Add Product A to cart and validate SKU/product, quantity, unit price and subtotal.
2. Change product quantity and validate recalculated subtotal.
3. Apply SAVE10 and validate a 10% discount.
4. Apply SAVE20 at/above the qualifying subtotal and validate a 20% discount.
5. Apply SAVE20 below the qualifying subtotal and verify an error and no discount.
6. Apply an invalid coupon and verify an error and no discount.
7. Complete checkout and validate order confirmation.

The assignment specifies at least six meaningful scenarios; the data-driven suite contains six combinations and exercises positive and negative paths.

## Important assumption

The supplied exercise does not include an application URL or DOM contract. Therefore:
- `BASE_URL` is configurable.
- Locators use semantic roles, labels and a small number of `data-testid` values.
- The expected test-data names/selectors are assumptions and should be aligned with the target storefront.
- Prices are read from the application at runtime rather than hardcoded, so the suite is resilient when prices differ by environment.

## Prerequisites

- Node.js 20+
- npm
- Access to the target storefront

## Install

```bash
npm ci
npx playwright install --with-deps
```

## Run

```bash
BASE_URL=https://qa.example.com npm test
BASE_URL=https://qa.example.com npm run test:smoke
BASE_URL=https://qa.example.com npm run test:regression
npm run typecheck
npm run report
```

On Windows PowerShell:

```powershell
$env:BASE_URL="https://qa.example.com"
npm test
```

## Architecture

- `tests/pages`: Page Object Model; UI behavior and locators.
- `tests/data`: data-driven business combinations.
- `tests/utils`: pure calculation helpers.
- `tests/fixtures`: dependency injection for page objects.
- `tests/checkout.spec.ts`: business-level scenarios.
- `playwright.config.ts`: execution, retries, tracing, screenshots, video and reporting.
- `.gitlab-ci.yml`: merge-request validation, smoke and sharded regression.

## Data-driven design

The test code loops through JSON scenarios. Adding a new product/quantity/coupon/customer combination only requires a data entry, not a new test method.

The suite uses tags in the test title:
- `@smoke`
- `@regression`

A scenario can belong to both.

## Price strategy

The environment may change prices. The test reads the displayed unit price and validates subtotal/discount/total mathematically. This avoids brittle hardcoded prices.

## Wait strategy

No `waitForTimeout` is used. Playwright locators and assertions wait for the required state. The order confirmation has a targeted 15-second assertion timeout because the exercise states that one UI element can take several seconds to become available.

## CI/CD

Merge requests:
1. TypeScript validation
2. Smoke tests
3. Reports and traces retained as artifacts

Scheduled/default-branch regression:
- Four Playwright shards run in parallel.
- Artifacts are retained for debugging.
- Regression can be triggered manually from the default branch.

For a real GitLab project, `BASE_URL` should be stored as an environment/group/project CI variable rather than committed if it is environment-specific. Credentials should always be GitLab protected/masked variables.

## Scaling beyond 500 combinations

The JSON dataset remains external to test logic. Playwright parallelism and CI sharding allow combinations to execute concurrently. If the dataset becomes much larger, I would split data by domain/product/promotion and use scheduled shards or a generated test manifest while keeping deterministic scenario IDs.

## What I would improve with more time

- Align selectors to the real application and add stable test IDs where the product team supports them.
- Add API/database setup for deterministic test data if those interfaces are available.
- Add JUnit reporting and GitLab test report integration.
- Add accessibility and cross-browser projects where required.
- Add environment-specific config and secret management.
- Add a promotion rules utility if eligibility rules become more complex.
- Add a dedicated order API verification layer if available.
