describe('Test de la recherche de situation', () => {
  describe(`Depuis la page d'accueil`, () => {
    beforeEach(() => {
      cy.visit('/');
    });

    describe(`Test de la recherche d'adresse`, () => {
      it(`La recherche doit renvoyer plusieurs résultats`, () => {
        cy.searchAddress();
        cy.location('pathname').should('equal', '/situation/adresse');
      });
    });
  });
  
  describe(`Depuis la page de recherche`, () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('.fr-header .fr-btns-group').find('a').first().click();
      cy.location('pathname').should('equal', '/situation/recherche');
    });

    describe(`Test de la recherche d'adresse`, () => {
      it(`La recherche doit renvoyer plusieurs résultats`, () => {
        cy.get('[data-cy=SituationRechercheBtn]').should('be.disabled');
        cy.searchAddress();
        cy.get('[data-cy=SituationRechercheBtn]').click();
        cy.location('pathname').should('equal', '/situation/adresse');
      });
    });
  });
});