#!/bin/bash

# CI/CD Infrastructure Setup Verification Script
# This script validates that all CI/CD components are properly configured

set -e

echo "🔍 CI/CD Infrastructure Verification"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

echo "📋 Configuration Files:"
check_file "jest.config.ts"
check_file "jest.setup.ts"
check_file ".lintstagedrc.json"
check_file ".husky/pre-commit"
check_file ".github/workflows/ci.yml"
check_file ".github/agents/ci-testing.agent.md"

echo ""
echo "📚 Documentation Files:"
check_file "docs/CI_CD_SETUP.md"
check_file "docs/CI_CD_DEPLOYMENT_SUMMARY.md"

echo ""
echo "🧪 Sample Test Files:"
check_file "app/lib/__tests__/utils.test.ts"
check_file "app/ui/__tests__/search.test.tsx"

echo ""
echo "📦 Dependencies Check:"
echo "Checking if required dependencies are installed..."

required_deps=(
  "husky"
  "lint-staged"
  "jest"
  "ts-jest"
  "ts-node"
  "@testing-library/react"
  "@testing-library/jest-dom"
)

for dep in "${required_deps[@]}"; do
  if npm ls "$dep" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $dep"
  else
    echo -e "${YELLOW}⚠${NC} $dep (may need installation)"
  fi
done

echo ""
echo "🚀 Available Commands:"
echo "Run: pnpm test             # Run tests once"
echo "Run: pnpm test:watch       # Run tests in watch mode"
echo "Run: pnpm test:coverage    # Generate coverage report"
echo "Run: pnpm lint:fix         # Fix linting issues"
echo "Run: pnpm type-check       # Check TypeScript types"
echo "Run: pnpm ci:full          # Run complete CI locally"

echo ""
echo "✅ CI/CD infrastructure setup complete!"
echo ""
echo "Next steps:"
echo "1. Review docs/CI_CD_DEPLOYMENT_SUMMARY.md for overview"
echo "2. Read docs/CI_CD_SETUP.md for detailed configuration"
echo "3. Run 'pnpm test:watch' to test while developing"
echo "4. Check .github/agents/ci-testing.agent.md for agent guidelines"
