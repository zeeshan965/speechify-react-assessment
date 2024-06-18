import GithubActionsReporter from "vitest-github-actions-reporter";
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*/*.test.ts", "**/*/*.test.tsx"],
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
    },
    setupFiles: ["./vitest-setup.ts"],
    outputFile: {
      junit: "test-results.xml",
    },
    reporters: process.env.CI
      ? [
          "junit",
          new GithubActionsReporter({
            hideStackTrace: true,
            trimRepositoryPrefix: true,
          }),
        ]
      : "default",
  },
});
