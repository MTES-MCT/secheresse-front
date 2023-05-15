describe(`Test de l'affichage des situations`, () => {
  it(`On doit être redirigé si il n'y a pas d'adresse`, () => {
    cy.visit('/situation/adresse');
    cy.location('pathname').should('equal', '/');
  });
  
  describe(`Quand il y a une adresse recherchée`, () => {    
    it(`La page doit s'afficher correctement pour un état de vigilance`, () => {
      cy.visit('/situation');
      cy.searchAddress();
      cy.get('[data-cy=SituationRechercheBtn]').click();
      cy.location('pathname').should('equal', '/situation/adresse');
      
      cy.get('body .fr-header').should('exist');
      cy.get('body .situation-status').should('exist');
      cy.get('body .gestes').should('exist');
      cy.get('body .fr-footer').should('exist');
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
});