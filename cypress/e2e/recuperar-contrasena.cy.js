describe('Recuperación de Contraseña', () => {
    beforeEach(() => {
      cy.visit('/recuperar-contrasena'); 
    });
  
    it('Debería mostrar mensaje de error si el correo es inválido', () => {
      cy.get('ion-input[formControlName="email"]').type('correo_invalido');
      cy.contains('E-mail inválido').should('exist');
    });
  
    it('Debería enviar el formulario si el correo es válido', () => {
      cy.get('ion-input[formControlName="email"]').type('usuario@ejemplo.com');
      cy.get('ion-button').contains('Enviar').click();
      cy.contains('Correo enviado exitosamente').should('exist'); 
    });
  });
  