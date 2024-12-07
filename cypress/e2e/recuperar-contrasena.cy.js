describe('Recuperar Contraseña', () => {
  beforeEach(() => {
    // Navegar a la página de "Recuperar Contraseña"
    cy.visit('http://localhost:8100/recuperar-contrasena');
  });

  it('Debería cargar la página correctamente', () => {
    cy.contains('Recuperar Contraseña').should('exist'); // Verifica que el título esté presente
    cy.get('form').should('exist'); // Verifica que el formulario esté presente
  });

  it('Debería mostrar un error si el email es inválido', () => {
    cy.get('ion-input[formcontrolname="email"] input')
      .type('email-invalido')
      .blur(); // Escribe un email inválido y pierde el foco
    cy.contains('E-mail inválido').should('be.visible'); // Verifica que el mensaje de error esté visible
  });

  it('Debería habilitar el botón al ingresar un email válido', () => {
    cy.get('ion-input[formcontrolname="email"] input').type('usuario@ejemplo.com'); // Escribe un email válido
    cy.get('ion-button[type="submit"]').should('not.be.disabled'); // Verifica que el botón está habilitado
  });

  it('Debería mostrar un mensaje de éxito al enviar un email válido', () => {
    cy.get('ion-input[formcontrolname="email"] input').type('usuario@ejemplo.com'); // Escribe un email válido
    cy.get('ion-button[type="submit"]').click(); // Envía el formulario

    // Simula el comportamiento de éxito
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Se ha enviado un enlace para recuperar su contraseña'); // Asegúrate de que coincida con el mensaje de éxito
    });
  });

  it('Debería regresar a la página de inicio de sesión al presionar el botón de retroceso', () => {
    cy.get('ion-back-button').click(); // Haz clic en el botón de retroceso
    cy.url().should('include', '/login'); // Verifica que redirige a la página de inicio de sesión
  });
});
