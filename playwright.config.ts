import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: process.env.CHATBOT_URL || 'https://ask.u.ae/en/',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    headless: false,
  },
  projects: [
    // Active project - Chrome only
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
       // viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'Chromium - CrossBrowser',
      use: { browserName: 'chromium' },
      grep: /@cross-browser/,
    },

    // {
    //   name: 'Firefox - CrossBrowser',
    //   use: { browserName: 'firefox' },
    //   grep: /@cross-browser/,
    // },

    // {
    //   name: 'WebKit - CrossBrowser',
    //   use: { browserName: 'webkit' },
    //   grep: /@cross-browser/,
    // },
    
    // {
    //   name: 'mobile-iphone',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     viewport: { width: 390, height: 844 }
    //   },
    // },
    //{
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 13'],
    //   },
    // },
 
  ],
};

export default config; 