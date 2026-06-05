import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.e2e.ts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8080",
  },
  webServer: [
    {
      command: "npm --prefix ../server run start",
      url: "http://localhost:5000/api/health",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      url: "http://localhost:8080",
      reuseExistingServer: true,
    },
  ],
});
