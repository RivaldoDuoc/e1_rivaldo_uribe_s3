describe('Pruebas básicas de la página de Login', () => {
  const baseUrl = 'http://localhost:8100'; // URL base de la aplicación

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`); // Navega a la página de login

    // Mock para simular almacenamiento en SQLite
    cy.window().then((win) => {
      cy.stub(win.localStorage, 'getItem')
        .withArgs('currentUser')
        .returns(null); // Simula que no hay un usuario logueado inicialmente
    });
  });

  it('Debería mostrar correctamente los campos y el botón de login', () => {
    // Verifica que los elementos principales existan
    cy.get('ion-input[formcontrolname="email"]').should('exist'); // Campo de correo electrónico
    cy.get('ion-input[formcontrolname="password"]').should('exist'); // Campo de contraseña
    cy.get('ion-button[type="submit"]').contains('ENTRAR').should('exist'); // Botón de envío
  });

  it('Debería permitir iniciar sesión con credenciales válidas (Mock)', () => {
    // Mock para simular respuesta de inicio de sesión exitosa
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { tipoUsuario: 'admin', email: 'riv.uribe@duocuc.cl' },
    }).as('mockLogin');

    // Simula el ingreso de credenciales válidas
    cy.get('ion-input[formcontrolname="email"]').type('riv.uribe@duocuc.cl');
    cy.get('ion-input[formcontrolname="password"]').type('111111');
    cy.get('ion-button[type="submit"]').click();

    // Espera la respuesta simulada del login
    cy.wait('@mockLogin');

    // Verifica que redirige correctamente al home
    cy.url().should('include', '/home');
  });

  it('Debería mostrar mensaje de error con credenciales inválidas', () => {
    // Mock para simular respuesta de error por credenciales inválidas
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Credenciales incorrectas' },
    }).as('mockInvalidLogin');

    // Simula el ingreso de credenciales inválidas
    cy.get('ion-input[formcontrolname="email"]').type('usuario@invalido.com');
    cy.get('ion-input[formcontrolname="password"]').type('123456');
    cy.get('ion-button[type="submit"]').click();

    // Espera la respuesta simulada
    cy.wait('@mockInvalidLogin');

    // Verifica que muestra el mensaje de error
    cy.get('ion-text.color-danger')
      .should('exist')
      .and('contain', 'Credenciales incorrectas');
  });
});

