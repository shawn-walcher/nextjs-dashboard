# CI/CD Setup Guide

This document provides a comprehensive overview of the CI/CD infrastructure configured for the Next.js Dashboard application.

## Overview

The CI/CD ecosystem consists of:

- **Local Development**: Husky pre-commit hooks with lint-staged
- **Testing Framework**: Jest with 80% coverage threshold
- **GitHub Actions**: Automated CI pipeline
- **Quality Agent**: GitHub Agent configuration for automation specialists

## Local Development Setup

### Pre-commit Hooks (Husky + lint-staged)

Husky automatically runs quality checks before each commit:

```bash
pnpm install  # Installs Husky hooks
```

Files are automatically checked on commit:

1. ESLint validates syntax and code quality
2. Jest runs related tests with --bail (stops on first failure)

**Bypassing hooks** (not recommended):

```bash
git commit --no-verify
```

### Testing Locally

Run tests with different modes:

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run the full CI pipeline locally
pnpm ci:full
```

### Type Checking

Verify TypeScript compilation:

```bash
pnpm type-check
```

### Linting

Fix all ESLint issues automatically:

```bash
pnpm lint:fix
```

## Configuration Files

### jest.config.ts

- **Coverage Provider**: v8 (performant)
- **Test Environment**: jsdom (browser-like)
- **Coverage Threshold**: 80% for branches, functions, lines, statements
- **Collected Files**: app/\*_/_.{js,jsx,ts,tsx}
- **Ignored**: .next, node_modules, .d.ts files, layout.tsx, page.tsx

### jest.setup.ts

- Sets up testing utilities
- Mocks environment variables
- Initializes test globals

### .lintstagedrc.json

Runs on staged files only:

- ESLint with auto-fix for JS/TS files
- Jest related tests with --bail flag
- Prettier for JSON files

### .husky/pre-commit

Executes lint-staged before commit is created

### .github/workflows/ci.yml

GitHub Actions workflow that runs on:

- Push to main/develop
- Pull requests to main/develop

**Steps**:

1. Checkout code
2. Setup pnpm with caching
3. Install dependencies (frozen lockfile)
4. Run ESLint
5. Type check with TypeScript
6. Run Jest with coverage
7. Upload coverage artifact
8. Comment on PR with coverage summary

## Test Coverage Requirements

All code must meet these thresholds:

```
Branches:    ≥80%
Functions:   ≥80%
Lines:       ≥80%
Statements:  ≥80%
```

### Excluded from Coverage

- `.next/` build directory
- `node_modules/` dependencies
- `*.d.ts` type definitions
- `layout.tsx` Next.js layouts
- `page.tsx` routing components

## Writing Tests

### Arrange-Act-Assert Pattern

Every test should follow this structure:

```typescript
it("should format currency correctly", () => {
  // Arrange: Set up test data and mocks
  const amountInCents = 1000;

  // Act: Execute the code being tested
  const result = formatCurrency(amountInCents);

  // Assert: Verify the outcome
  expect(result).toBe("$10.00");
});
```

### Best Practices

✅ **DO**

- Test behavior, not implementation
- Use descriptive test names
- Mock external dependencies
- Test edge cases and errors
- Keep tests isolated and focused
- Use meaningful assertions

❌ **DON'T**

- Test implementation details
- Create flaky timing-dependent tests
- Leave console.log statements
- Skip tests to meet deadlines
- Have tests with side effects
- Create interdependent tests

## GitHub Agent Configuration

The `ci-testing.agent.md` defines the Quality & Automation Specialist persona with:

- **Commands**: Quick access to test, lint, and CI scripts
- **Tools**: Read, editFiles, terminal for automating quality checks
- **Boundaries**: Strict rules about linting, coverage, and type safety
- **Workflow**: Pre-commit, CI, and quality gates phases

## Troubleshooting

### Tests Failing Locally but Passing in CI

- Ensure Node version matches (use 18.17+)
- Clear Jest cache: `jest --clearCache`
- Check for environment variable differences

### Coverage Below 80%

- Run: `pnpm test:coverage`
- Check `coverage/lcov-report/index.html` in browser
- Write tests for uncovered branches
- Review exclusion patterns in jest.config.ts

### Husky Hooks Not Running

- Reinstall: `pnpm install`
- Check hooks are executable: `ls -la .husky/`
- Verify pre-commit file has shebang: `#!/bin/sh`

### CI Failing on Type Check

- Run locally: `pnpm type-check`
- Check for `any` types
- Verify all imports are correct
- Review TypeScript errors in detail

## Continuous Improvement

### Monitoring Coverage Trends

- Coverage reports are uploaded to artifacts
- PR comments show coverage summary
- Track coverage.json for historical data

### Adding New Tests

1. Create test file in `__tests__` directory
2. Use descriptive names matching source file
3. Follow Arrange-Act-Assert pattern
4. Run locally with `pnpm test:watch`
5. Verify coverage with `pnpm test:coverage`

### Updating Configuration

- **Jest**: Modify `jest.config.ts`
- **ESLint**: Update `.eslintrc.json`
- **Husky**: Edit `.husky/pre-commit`
- **lint-staged**: Modify `.lintstagedrc.json`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
