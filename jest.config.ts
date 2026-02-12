import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react",
      },
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.test.tsx",
    "**/*.test.ts",
    "**/*.test.tsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(next-auth)/)"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    // Exclude type definition files
    "!app/**/*.d.ts",
    // Exclude Next.js page and layout components (typically integration tested)
    "!app/**/layout.tsx",
    "!app/**/page.tsx",
    "!app/**/error.tsx",
    "!app/**/loading.tsx",
    "!app/**/not-found.tsx",
    // Exclude CSS and build artifacts
    "!app/**/*.module.css",
    "!app/.next/**",
    // Exclude test files themselves
    "!app/**/__tests__/**",
    // Exclude configuration and setup files
    "!app/**/fonts.ts",
    "!app/**/route.ts",
    "!app/**/auth.ts",
    "!app/**/auth.config.ts",
    "!app/**/proxy.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
