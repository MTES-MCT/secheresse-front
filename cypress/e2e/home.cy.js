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
    cy.get('body .situation').should('exist');
    cy.get('body .gestes').should('exist');
    cy.get('body .situation-status').should('not.exist');
    cy.get('body .fr-footer').should('exist');
  });

  describe(`Header`, () => {
    it(`Le header doit s'afficher correctement`, () => {
      cy.get('body .fr-header').should('exist');
      cy.get('body .fr-header .fr-logo').contains('République').should('exist');
      cy.get('body .fr-header .fr-logo').contains('Française').should('exist');
      cy.get('body .fr-header .fr-header__service').contains('Alerte sécheresse').should('exist');      
    });
  });

  describe(`Footer`, () => {
    it(`Le footer doit s'afficher correctement`, () => {
      cy.get('body .fr-footer').should('exist');
      cy.get('body .fr-footer .fr-logo').contains('République').should('exist');
      cy.get('body .fr-footer .fr-logo').contains('Française').should('exist');
      cy.get('body .fr-footer .fr-footer__content-list').find('li').should('have.length', 4);
      cy.get('body .fr-footer .fr-footer__bottom-list').find('li').should('have.length', 4);
    });
  });
  
  describe(`Bloc présentation`, () => {
    it(`Le bloc présentation doit s'afficher correctement`, () => {
      cy.get('body .presentation h1').contains('Restez informé en temps réel des restrictions d\'eau en France').should('exist');
      cy.get('body .presentation [data-cy=AddressSearchInput]').should('exist');
    });
  });
})