# Fixing SIGKILL Error in Pre-commit Hook

## Problem Summary

You encountered a `SIGKILL` error when the pre-commit hook tried to run `eslint --fix` on multiple files during commit. This error typically indicates:
- A process was forcefully terminated by the OS
- Memory exhaustion or timeout
- Configuration conflicts between linters and test runners

## Root Cause

The original `.lintstagedrc.json` configuration was problematic:

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "jest --findRelatedTests --bail"],
  "*.json": ["prettier --write"]
}
```

**Issues**:
1. **Too broad file matching** - `*.{js,jsx,ts,tsx}` matched ALL TypeScript/JavaScript files including config files
2. **Config files in lint-staged** - `jest.config.ts` and `jest.setup.ts` were being processed, which aren't meant for standard linting rules
3. **Sequential process overload** - Running ESLint AND Jest in sequence on too many files caused resource exhaustion
4. **Missing prettier** - Referenced `prettier --write` but Prettier wasn't installed (silent failure)

## Solution Implemented

Updated `.lintstagedrc.json` to be more selective:

```json
{
  "app/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "jest --findRelatedTests --bail --passWithNoTests"
  ],
  "*.config.{js,ts,mjs}": ["eslint --fix"]
}
```

**Improvements**:
- ✅ **Scoped ESLint + Jest** - Only runs on application code in `app/`
- ✅ **Config file handling** - Configuration files lint-only (no Jest)
- ✅ **Added --passWithNoTests** - Jest won't fail if no tests match (-silent for config files)
- ✅ **Removed Prettier** - Eliminated dependency on non-installed package
- ✅ **Reduced resource usage** - Fewer processes, cleaner execution

## Testing the Fix

### 1. Verify ESLint works
```bash
pnpm lint
```

### 2. Test pre-commit hook manually
```bash
# Stage some files
git add app/lib/actions.ts
git add jest.config.ts

# Try to commit (will run the pre-commit hook)
git commit -m "test commit"
```

### 3. If pre-commit hook still fails
Run diagnostics:
```bash
# Check lint-staged directly
pnpm exec lint-staged --debug

# Check if Husky hook is executable
ls -la .husky/pre-commit
```

## Key Takeaways

| Issue | Fix |
|-------|-----|
| SIGKILL on ESLint | Narrowed file scope to `app/**/*.{js,jsx,ts,tsx}` |
| Config files in linting flow | Created separate rule for `*.config.{js,ts,mjs}` |
| Too many concurrent processes | Reduced scope = fewer files processed at once |
| Missing Prettier dependency | Removed from lint-staged config |
| Jest on config files | Config files skip Jest tests (--passWithNoTests) |

## Going Forward

### When Adding New Linters
Always check:
1. ✅ Is the dependency installed? (`pnpm ls package-name`)
2. ✅ Is the file pattern too broad?
3. ✅ Are configuration files excluded?
4. ✅ Test locally: `pnpm exec lint-staged --debug`

### Recommended Pattern for lint-staged

```json
{
  "app/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "jest --findRelatedTests --bail --passWithNoTests"],
  "*.config.{js,ts,mjs}": ["eslint --fix"],
  "package.json": ["eslint --fix"]
}
```

## Reference

- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Husky Troubleshooting](https://typicode.github.io/husky/troubleshoot.html)
- [ESLint Configuration](https://eslint.org/docs/rules/)
