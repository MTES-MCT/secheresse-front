describe('Test de la home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it(`Nous devons bien arriver sur la page d'accueil`, () => {
    cy.visit('/');
    cy.location('pathname').should('equal', '/');
  });

  it(`La page doit s'afficher correctement`, () => {
    cy.get('body .fr-header').should('exist');
    cy.get('body .presentation').should('exist');
    cy.get('body .gestes').should('exist');
    cy.get('body .liens').should('exist');
    cy.get('body .faq').should('exist');
    cy.get('body .fr-footer').should('exist');
  });

  describe(`Header`, () => {
    it(`Le header doit s'afficher correctement`, () => {
      cy.get('body .fr-header').should('exist');
      cy.get('body .fr-header .fr-logo').contains('Gouvernement').should('exist');
    });
  });

  describe(`Footer`, () => {
    it(`Le footer doit s'afficher correctement`, () => {
      cy.get('body .fr-footer').should('exist');
      cy.get('body .fr-header .fr-logo').contains('Gouvernement').should('exist');
      cy.get('body .fr-footer .fr-footer__content-list').find('li').should('have.length', 3);
      cy.get('body .fr-footer .fr-footer__bottom-list').find('li').should('have.length', 4);
    });
    
    it(`On doit pouvoir accéder aux pages légales depuis le footer`, () => {
      cy.get('body .fr-footer [data-testid="/accessibilite"]').should('exist');
      cy.get('body .fr-footer [data-testid="/mentions-legales"]').should('exist');
      cy.get('body .fr-footer [data-testid="/donnees-personnelles"]').should('exist');
      cy.get('body .fr-footer [data-testid="/cookies"]').should('exist');

      cy.get('body .fr-footer [data-testid="/accessibilite"]').click();
      cy.location('pathname').should('equal', '/accessibilite');

      cy.get('body .fr-footer [data-testid="/mentions-legales"]').click();
      cy.location('pathname').should('equal', '/mentions-legales');

      cy.get('body .fr-footer [data-testid="/donnees-personnelles"]').click();
      cy.location('pathname').should('equal', '/donnees-personnelles');

      cy.get('body .fr-footer [data-testid="/cookies"]').click();
      cy.location('pathname').should('equal', '/cookies');
    });
  });
  
  describe(`Bloc présentation`, () => {
    it(`Le bloc présentation doit s'afficher correctement`, () => {
      cy.get('body .presentation [data-cy=ProfileSelection]').should('exist');
      cy.get('body .presentation [data-cy=AddressSearchInput]').should('exist');
    });
  });
})