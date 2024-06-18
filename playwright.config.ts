import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "tests",

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: process.env.CI
    ? [["junit", {outputFile: "test-results.xml"}]]
    : "html",

  use: {
    // Collect trace when retrying the failed test.
    trace: "on-first-retry",
    headless: process.env.CI ? true : false,
    screenshot: "on",
    video: "on",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run dev -- --port 4242",
    port: 4242,
    timeout: 120 * 1000, // 2 minutes,
    reuseExistingServer: false,
  },
});
