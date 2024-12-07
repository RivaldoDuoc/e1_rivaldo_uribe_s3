describe('Mi Perfil Page', () => {
  beforeEach(() => {
    // Mockear los datos iniciales del perfil si se cargan desde una base de datos
    cy.intercept('GET', '/api/mi-perfil', {
      statusCode: 200,
      body: {
        nombre: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '1990-01-01',
        email: 'juan.perez@example.com',
      },
    });

    // Mockear la respuesta del guardado del perfil
    cy.intercept('POST', '/api/mi-perfil', {
      statusCode: 200,
      body: { success: true },
    });

    // Visitar la página de "Mi Perfil"
    cy.visit('/mi-perfil');
  });

  it('should display the user profile form', () => {
    // Verifica que el formulario y los campos estén visibles
    cy.get('form').should('be.visible');
    cy.get('ion-input[formControlName="nombre"]').should('have.value', 'Juan');
    cy.get('ion-input[formControlName="apellidos"]').should('have.value', 'Pérez');
    cy.get('ion-input[formControlName="fechaNacimiento"]').should('have.value', '1990-01-01');
    cy.get('ion-input[formControlName="email"]').should('have.value', 'juan.perez@example.com');
  });

  it('should show validation errors for required fields', () => {
    // Vaciar los campos obligatorios y perder el foco para activar las validaciones
    cy.get('ion-input[formControlName="nombre"]').clear().blur();
    cy.get('ion-input[formControlName="apellidos"]').clear().blur();
    cy.get('ion-input[formControlName="fechaNacimiento"]').clear().blur();

    // Verificar los mensajes de error
    cy.contains('Nombre es requerido').should('be.visible');
    cy.contains('Apellidos son requeridos').should('be.visible');
    cy.contains('Fecha de Nacimiento es requerida').should('be.visible');
  });

  it('should save the user profile with valid data', () => {
    // Llenar los campos del formulario con datos válidos
    cy.get('ion-input[formControlName="nombre"]').clear().type('Carlos');
    cy.get('ion-input[formControlName="apellidos"]').clear().type('Gómez');
    cy.get('ion-input[formControlName="fechaNacimiento"]').clear().type('1985-06-15');
    cy.get('ion-input[formControlName="email"]').clear().type('carlos.gomez@example.com');
    cy.get('ion-input[formControlName="password"]').type('1234');
    cy.get('ion-input[formControlName="confirmPassword"]').type('1234');

    // Clic en el botón "Guardar"
    cy.get('ion-button[type="submit"]').click();

    // Verificar que se muestra un mensaje de éxito (mockeado)
    cy.contains('El formulario es válido, puede guardarlo.').should('be.visible');
  });

  it('should show error if passwords do not match', () => {
    // Llenar los campos de contraseña con datos no coincidentes
    cy.get('ion-input[formControlName="password"]').type('1234');
    cy.get('ion-input[formControlName="confirmPassword"]').type('5678');

    // Verificar el mensaje de error
    cy.contains('Las contraseñas no coinciden').should('be.visible');

    // Verificar que el botón "Guardar" esté deshabilitado
    cy.get('ion-button[type="submit"]').should('be.disabled');
  });
});
