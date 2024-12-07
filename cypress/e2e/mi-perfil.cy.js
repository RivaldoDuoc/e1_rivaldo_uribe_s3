describe('Página Mi Perfil - Pruebas E2E', () => {
  beforeEach(() => {
    // Interceptamos las llamadas a la base de datos o servicios necesarios
    cy.intercept('GET', '/api/usuarios', {
      fixture: 'usuarios.json',
    });

    cy.visit('http://localhost:8100/mi-perfil'); // Ruta de la página
  });

  it('Debería cargar correctamente la página de Mi Perfil', () => {
    cy.get('ion-title').should('contain', 'Registro de Usuario'); // Verificar título
  });

  it('Debería mostrar validaciones en los campos obligatorios', () => {
    // Verificar campo de nombre
    cy.get('ion-input[formcontrolname="nombre"]').type('{backspace}');
    cy.get('ion-text[color="danger"]').should('contain', 'Nombre es requerido');

    // Verificar campo de apellidos
    cy.get('ion-input[formcontrolname="apellidos"]').type('{backspace}');
    cy.get('ion-text[color="danger"]').should('contain', 'Apellidos son requeridos');

    // Verificar campo de email
    cy.get('ion-input[formcontrolname="email"]').type('correo-invalido');
    cy.get('ion-text[color="danger"]').should('contain', 'E-mail inválido');
  });

  it('Debería permitir guardar un perfil válido', () => {
    cy.get('ion-input[formcontrolname="nombre"]').type('Juan');
    cy.get('ion-input[formcontrolname="apellidos"]').type('Pérez');
    cy.get('ion-input[formcontrolname="fechaNacimiento"]').type('1990-01-01');
    cy.get('ion-input[formcontrolname="email"]').type('juan.perez@correo.com');
    cy.get('ion-input[formcontrolname="password"]').type('1234');
    cy.get('ion-input[formcontrolname="confirmPassword"]').type('1234');

    cy.get('ion-button[type="submit"]').should('not.be.disabled').click();

    cy.get('ion-text[color="green"]').should(
      'contain',
      'El formulario es válido, puede guardarlo.'
    );
  });

  it('Debería mostrar un mensaje de error si las contraseñas no coinciden', () => {
    cy.get('ion-input[formcontrolname="password"]').type('1234');
    cy.get('ion-input[formcontrolname="confirmPassword"]').type('5678');

    cy.get('ion-text[color="danger"]').should('contain', 'Las contraseñas no coinciden');
  });
});
