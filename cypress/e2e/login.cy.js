import { errorMessages } from "../../src/components/Login";

describe('Login Page', () => {
  describe('Error Messages', () => {

    it('email input throws error for emre@wit.', () => {
      cy.visit('http://localhost:5173/');
      cy.get('[data-cy="Email-input"]').type('emre@wit.');
      cy.get('[data-cy="error-message"]').should('contain', errorMessages.email);
    });

    it('password input throws error for 123', () => {
      cy.visit('http://localhost:5173/');
      cy.get('[data-cy="Password-input"]').type('123');
      cy.get('[data-cy="error-message"]').should('contain', errorMessages.password);
    });

    it('button is disabled for unvalidated inputs.', () => {
      cy.visit('http://localhost:5173/');
      cy.get('[data-cy="Password-input"]').type('1234');
      cy.get('[data-cy="submit-button"]').should('be.disabled');
    });

  });

  describe('Form inputs validated', () => {
    it('button enabled for validated inputs', () => {
      cy.visit('http://localhost:5173/');
      cy.get('[data-cy="Email-input"]').type('emre@wit.com.tr');
      cy.get('[data-cy="Password-input"]').type('1234Aa**');
      cy.get('#terms').check(); // 🔥 Checkbox eklendi!
      cy.get('[data-cy="submit-button"]').should('not.be.disabled');
    });
  });
});
