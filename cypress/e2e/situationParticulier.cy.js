describe(`Test de l'affichage des situations pour les particuliers`, () => {
  it(`On doit être redirigé si il n'y a pas d'adresse`, () => {
    cy.visit('/situation');
    cy.location('pathname').should('equal', '/');
  });

  describe(`Quand il y a une adresse recherchée`, () => {
    it(`La page doit s'afficher correctement pour un état avec des restrictions`, () => {
      cy.visit('/situation');
      cy.searchAddress();
      cy.location('pathname').should('equal', '/situation');

      cy.get('body .fr-header').should('exist');
      cy.get('body .situation-status').should('exist');
      cy.get('body .gestes').should('exist');
      cy.get('body .liens').should('exist');
      cy.get('body .faq').should('exist');
      cy.get('body .fr-footer').should('exist');
      cy.get('body .situation-status').find('.fr-tag').should('exist');
    });
  })

  describe(`Quand il y a des paramètres dans l'URL`, () => {
    it(`La page doit s'afficher correctement pour un état avec des restrictions`, () => {
      cy.visit('/situation?adresse=Marseille+12e+Arrondissement,+13&profil=particulier');
      cy.location('pathname').should('equal', '/situation');

      cy.get('body .fr-header').should('exist');
      cy.get('body .situation-status').should('exist');
      cy.get('body .gestes').should('exist');
      cy.get('body .liens').should('exist');
      cy.get('body .faq').should('exist');
      cy.get('body .fr-footer').should('exist');
      cy.get('body .situation-status').find('.fr-tag').should('exist');
    });

    it(`La page doit s'afficher correctement pour un état sans restrictions`, () => {
      cy.visit('/situation?adresse=Brest,+29&profil=particulier');
      cy.location('pathname').should('equal', '/situation');

      cy.get('body .fr-header').should('exist');
      cy.get('body .situation-status').should('exist');
      cy.get('body .gestes').should('exist');
      cy.get('body .liens').should('exist');
      cy.get('body .faq').should('exist');
      cy.get('body .fr-footer').should('exist');
      cy.get('body .situation-status').find('.fr-tag').should('not.exist');
    });
  });
});