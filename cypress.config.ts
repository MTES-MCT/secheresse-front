import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "",
  numTestsKeptInMemory: 5,
  experimentalMemoryManagement: true,
  defaultCommandTimeout: 10000,
  
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },

  viewportHeight: 800,
  viewportWidth: 1400
});
