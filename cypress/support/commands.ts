Cypress.Commands.add('searchAddress', () => {
  cy.intercept({
    method: 'GET',
    url: 'https://api-adresse.data.gouv.fr/search/?q=*',
  }).as('addressSearch');
  cy.get('[data-cy=AddressSearchInput]').should('exist');
  cy.get('[data-cy=AddressSearchInput] input').clear();
  cy.get('[data-cy=AddressSearchInput] input').type('Marseille');
  cy.wait('@addressSearch').its('response.statusCode').should('equal', 200);
  cy.get('[data-cy=AddressSearchInput] ul').find('li').should('have.length', 10);
  cy.get('[data-cy=AddressSearchInput] ul').find('li').first().click();
});