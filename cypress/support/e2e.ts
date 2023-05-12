// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import '@cypress/code-coverage/support';

// see https://github.com/cypress-io/cypress/issues/702#issuecomment-587127275
Cypress.on('window:before:load', (win) => {
  // disable service workers
  // @ts-ignore
  delete win.navigator.__proto__.ServiceWorker
})

// Alternatively you can use CommonJS syntax:
// require('./commands')