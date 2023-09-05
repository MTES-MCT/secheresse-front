describe(`Test de l'affichage des eco gestes`, () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it(`Les eco gestes soivent s'afficher en tuiles avec deux tags`, () => {
    cy.get('body .gestes').should('exist');
    cy.get('body .gestes h2').contains('148 litres').should('exist');
    cy.get('body .gestes').find('button.fr-tag').should('have.length', 2);
    cy.get('body .gestes .fr-tabs__panel--selected .eau-card__title').contains(`En évitant de laisser couler l’eau du robinet`).should('exist');
    cy.get('body .gestes .fr-tabs__panel--selected .eau-card__title').contains(`En limitant les arrosages tout en évitant d’arroser en pleine journée`).should('not.exist');
    cy.get('body .gestes button.fr-tag').eq(1).wait(500).click();
    cy.get('body .gestes .fr-tabs__panel--selected .eau-card__title').contains(`En évitant de laisser couler l’eau du robinet`).should('not.exist');
    cy.get('body .gestes .fr-tabs__panel--selected .eau-card__title').contains(`En limitant les arrosages tout en évitant d’arroser en pleine journée`).should('exist');
  });
});