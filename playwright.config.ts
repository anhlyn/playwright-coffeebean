import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30000,
  fullyParallel: true,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  projects:[
    {
      name: 'E2E Testing',
      use:{
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL: 'https://valentinos-magic-beans.click'
      }
    },
    {
      name: 'API Testing',
      use:{
        baseURL: 'https://api.valentinos-magic-beans.click'
      }
    }
  ]
});