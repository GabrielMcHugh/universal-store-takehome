import { defineConfig } from '@playwright/test';

const PLP_URL = process.env.PLP_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: PLP_URL,
    headless: true,
    trace: 'on-first-retry',
  },
});