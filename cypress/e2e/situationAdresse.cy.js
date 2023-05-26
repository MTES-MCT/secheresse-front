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
      cy.get('body .faq').should('exist');
      cy.get('body .fr-footer').should('exist');
      cy.get('body .situation-status').find('.fr-tag').should('have.length', 6);
    });
  })
});