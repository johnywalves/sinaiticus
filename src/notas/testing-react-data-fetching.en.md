---
title: "Testing a React Component That Fetches on Mount"
layout: base.njk
category: Frontend
tags: [testing, react, frontend, interview]
---

Note from the [[nix-interview-prep|N-iX interview prep]] — practical case of [[frontend-testing-practices|frontend testing]].

**Summary:** I test all three states: **loading**, **success**, and **error** —
using **React Testing Library** and **MSW (Mock Service Worker)**.

## Steps

1. **Mock the API (MSW):** intercept the fetch request and return mock data;
   configure different responses per test case (success, error, loading).
2. **Test loading state:** render, assert a spinner/skeleton is displayed, ensure
   data is not rendered yet.
3. **Test success state:** MSW returns success; assert data is rendered
   (`screen.getByText('User Name')`); check loading disappears.
4. **Test error state:** MSW returns a 500 / network error; assert an error
   message is displayed; check retry (if implemented).
5. **Test edge cases:** empty array → "No items"; very large dataset → handles
   without crashing (maybe skip for unit tests, cover in E2E).

```tsx
test("displays user data after successful fetch", async () => {
  render(<UserProfile userId={1} />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  const name = await screen.findByText("John Doe");
  expect(name).toBeInTheDocument();
});
```

**Real-world practice:** I use Testing Library queries that resemble how users
interact (`findBy`, `getBy`, `queryBy`) and avoid testing implementation details
(e.g., checking if a specific function was called).

---

Related: [[azure-devops-cicd-pipeline|CI/CD gates]] ·
[[shared-component-library-versioning|component library tests]] ·
[[nix-interview-prep|index]].
