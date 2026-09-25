Design Decisions

## 1. Objective

The supplied exercise asks for an enterprise-evolvable e-commerce automation solution using TypeScript, Playwright, GitLab CI/CD and data-driven testing. It explicitly values reasoning and maintainability over test count.

## 2. Architecture

I chose:
- Page Object Model for UI interaction.
- Playwright fixtures for dependency injection.
- JSON for business test data.
- Utility functions for deterministic money calculations.
- Environment variables for environment-specific configuration.
- Tags for smoke/regression selection.
- GitLab stages for validation, smoke and regression.

The principle is:

`Fixture injects dependencies. Page Object owns UI interaction. Test owns business intent. Data owns scenario combinations. Utility owns reusable calculations.`

## 3. Locators

Priority:
1. Accessible role/name
2. Label
3. Stable `data-testid` for values that are difficult to identify semantically

I intentionally avoid CSS/XPath tied to presentation classes.

The exercise does not provide the target application's DOM, so locator names are documented assumptions rather than claims about an unseen application.

## 4. Dynamic prices

The exercise states that prices may differ or change between environments. Therefore the test obtains unit price from the UI and calculates expected subtotal/discount/total from that runtime value.

This is preferable to embedding `$100`, `$200`, etc. as product prices.

The `$200` value is a business-rule threshold from the exercise and therefore remains in the scenario data.

## 5. Waiting

The exercise states that one UI element may take several seconds to become available. I use Playwright's auto-waiting and targeted assertions instead of arbitrary sleeps.

The order-confirmation assertion has a longer timeout because it represents a known business/UI synchronization point.

## 6. Data-driven strategy

Business combinations are externalized in `checkout-data.json`.

Adding:

```json
{
  "id": "new-combination",
  "product": "Product B",
  "quantity": 2,
  "coupon": "SAVE10"
}
```

does not require a new test method.

This is important because the exercise expects the dataset to grow from roughly 10 to more than 500 combinations.

## 7. Scenario selection

`@smoke` is reserved for the small set of high-value paths:
- successful checkout
- core promotion
- invalid coupon
- critical cart behavior

`@regression` covers the broader combinations.

The same scenario can carry both tags.

## 8. Retry strategy

Retries are disabled locally and enabled in CI. This provides debugging clarity during development while allowing transient infrastructure/browser failures to receive a controlled second attempt in CI.

Retries are not treated as a substitute for fixing product defects.

## 9. Debugging

CI keeps:
- HTML report
- test-results
- screenshots on failure
- video on failure
- Playwright trace on first retry

This provides enough evidence to diagnose locator, timing and functional failures.

## 10. GitLab pipeline

The pipeline has:
- `validate`: install and TypeScript validation
- `smoke`: fast merge-request feedback
- `regression`: broader suite, sharded four ways

Regression is manual on the default branch and can also run on a schedule.

As the suite grows, shard count can be increased based on measured execution time rather than creating hundreds of independent jobs.

## 11. Trade-offs

### JSON vs database
JSON is intentionally simple and reviewable for a take-home exercise. For large enterprise datasets with frequent updates, a database or service-backed test-data layer may be more appropriate.

### POM vs excessive abstraction
The solution keeps POM focused on UI behavior. It avoids generic "do everything" wrapper classes because they make failures harder to understand.

### UI-only validation
The assignment is specifically web automation. If stable API contracts exist, API setup/cleanup and backend verification would reduce UI test data setup and make end-to-end tests more deterministic.

## 12. Assumptions

- The target storefront supports Product A.
- Product rows expose a unit price and quantity.
- Cart exposes subtotal, discount and total.
- Coupon errors are accessible through an alert-like element.
- Checkout fields have accessible labels.
- Order confirmation has an accessible heading.
- The actual application URL and DOM selectors were not supplied in the exercise.

## 13. Further improvements

With additional time:
1. Add real application selectors after inspecting the storefront.
2. Add browser projects for Chromium, Firefox and WebKit if supported.
3. Add JUnit/GitLab test reports.
4. Add API-based test-data setup.
5. Add contract/schema checks if APIs exist.
6. Add code quality/linting and dependency auditing.
7. Add scheduled nightly full regression and historical trend reporting.
