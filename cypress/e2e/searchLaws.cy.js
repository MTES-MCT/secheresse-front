describe('Test de la recherche des interdictions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe(`Test de la recherche d'adresse`, () => {
    it(`La recherche doit renvoyer plusieurs résultats`, () => {
      cy.intercept({
        method: 'GET',
        url: 'https://api-adresse.data.gouv.fr/search/?q=*',
      }).as('addressSearch');
      cy.get('body .presentation [data-cy=AddressSearchInput]').should('exist');
      cy.get('body .presentation [data-cy=AddressSearchInput] input').clear();
      cy.get('body .presentation [data-cy=AddressSearchInput] input').type('20 avenue de Ségur');
      cy.wait('@addressSearch').its('response.statusCode').should('equal', 200);
      cy.get('body .presentation [data-cy=AddressSearchInput] ul').find('li').should('have.length', 10);
      cy.get('body .presentation [data-cy=AddressSearchInput] ul').find('li').first().click();
      cy.wait(200);
      cy.get('body .presentation [data-cy=AddressSearchInput] ul').find('li').should('have.length', 0);
      cy.get('body .situation-status').should('exist');
      cy.get('body .situation').should('not.exist');
    });

    it(`Quand on reset l'adresse, la situation détaillée doit disparaître`, () => {
      cy.intercept({
        method: 'GET',
        url: 'https://api-adresse.data.gouv.fr/search/?q=*',
      }).as('addressSearch');
      cy.get('body .presentation [data-cy=AddressSearchInput] input').clear();
      cy.get('body .presentation [data-cy=AddressSearchInput] input').type('20 avenue de Ségur');
      cy.wait('@addressSearch').its('response.statusCode').should('equal', 200);
      cy.get('body .presentation [data-cy=AddressSearchInput] ul').find('li').first().click();
      cy.wait(200);
      cy.get('body .situation-status').should('exist');
      cy.get('body .situation').should('not.exist');
      cy.get('body .presentation [data-cy=AddressSearchInput] input').clear();
      cy.wait(500);
      cy.get('body .situation-status').should('not.exist');
      cy.get('body .situation').should('exist');
    });
  });

  describe(`Test de l'affichage des restrictions`, () => {
    it(`Quand un territoire est en alerte, on doit pouvoir consulter les différentes informations`, () => {
      cy.intercept({
        method: 'GET',
        url: 'https://api-adresse.data.gouv.fr/search/?q=*',
      }).as('addressSearch');
      cy.get('body .presentation [data-cy=AddressSearchInput] input').clear();
      cy.get('body .presentation [data-cy=AddressSearchInput] input').type('20 avenue de Ségur');
      cy.wait('@addressSearch').its('response.statusCode').should('equal', 200);
      cy.get('body .presentation [data-cy=AddressSearchInput] ul').find('li').first().click();
      cy.wait(200);
      cy.get('body .situation-status').should('exist');
      cy.get('body .situation-status .fr-tabs .fr-tabs__list').find('li').should('have.length', 3);
      cy.get('body .situation-status .fr-tabs #interdictions.fr-tabs__panel--selected').should('exist');
      cy.get('body .situation-status .fr-tabs #limitations.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #sensibilisation.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #limitations.fr-tabs__tab').click();
      cy.get('body .situation-status .fr-tabs #interdictions.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #limitations.fr-tabs__panel--selected').should('exist');
      cy.get('body .situation-status .fr-tabs #sensibilisation.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #sensibilisation.fr-tabs__tab').click();
      cy.get('body .situation-status .fr-tabs #interdictions.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #limitations.fr-tabs__panel--selected').should('not.exist');
      cy.get('body .situation-status .fr-tabs #sensibilisation.fr-tabs__panel--selected').should('exist');
    });
  })
})