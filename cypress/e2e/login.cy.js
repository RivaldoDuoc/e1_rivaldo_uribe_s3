describe('Página de Login (Pruebas optimizadas)', () => {
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

  it('Debería mostrar correctamente los elementos del login', () => {
    // Verifica que los elementos principales estén presentes
    cy.get('ion-input[formcontrolname="email"]').should('exist'); // Correo
    cy.get('ion-input[formcontrolname="password"]').should('exist'); // Contraseña
    cy.get('ion-button[type="submit"]').contains('ENTRAR').should('exist'); // Botón de enviar
  });

  it('Debería iniciar sesión correctamente con credenciales válidas (Mock)', () => {
    // Mock para simular credenciales válidas
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { tipoUsuario: 'admin', email: 'riv.uribe@duocuc.cl' },
    }).as('mockLogin');

    // Simula ingreso de credenciales
    cy.get('ion-input[formcontrolname="email"]').type('riv.uribe@duocuc.cl');
    cy.get('ion-input[formcontrolname="password"]').type('111111');
    cy.get('ion-button[type="submit"]').click();

    // Espera a que se realice la solicitud de login
    cy.wait('@mockLogin');

    // Verifica que redirige al home
    cy.url().should('eq', `${baseUrl}/home`);
  });

  it('Debería mostrar un mensaje de error con credenciales inválidas', () => {
    // Mock para simular respuesta con credenciales inválidas
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Credenciales incorrectas' },
    }).as('mockInvalidLogin');

    // Simula ingreso de credenciales incorrectas
    cy.get('ion-input[formcontrolname="email"]').type('usuario@invalido.com');
    cy.get('ion-input[formcontrolname="password"]').type('123456');
    cy.get('ion-button[type="submit"]').click();

    // Espera a que se realice la solicitud de login
    cy.wait('@mockInvalidLogin');

    // Verifica que aparece el mensaje de error
    cy.get('ion-text.color-danger')
      .should('exist')
      .and('contain', 'Credenciales incorrectas');
  });

  it('Debería permitir navegar a la página de recuperar contraseña', () => {
    // Navega al enlace para recuperar contraseña
    cy.get('a').contains('RECUPERAR CONTRASEÑA').click();

    // Verifica que redirige correctamente
    cy.url().should('eq', `${baseUrl}/recuperar-contrasena`);
  });

  it('Debería permitir navegar a la página de registro', () => {
    // Navega al enlace para registrarse
    cy.get('a').contains('¿No tienes cuenta? Regístrate aquí').click();

    // Verifica que redirige correctamente
    cy.url().should('eq', `${baseUrl}/registro`);
  });
});
