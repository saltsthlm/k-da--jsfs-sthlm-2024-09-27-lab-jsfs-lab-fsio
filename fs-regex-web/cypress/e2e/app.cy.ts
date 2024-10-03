describe('template spec', () => {

  beforeEach(() => {
    cy.visit('/');
  })

  it('should have correct title', () => {
    cy.title().should('eq', 'Salt FS Intro');
  })

  it('should get 10 users', () => {
    cy.get('[data-testid="usersList"] li').should('have.length', 10);
  })

  it.only('should be able to search users', () => {
    cy.get('[data-testid="usersList"] li').should('have.length', 10);
    cy.get('#searchInput').type('yan');
    cy.get('[data-testid="usersList"] li').should('have.length', 2);
  })
})