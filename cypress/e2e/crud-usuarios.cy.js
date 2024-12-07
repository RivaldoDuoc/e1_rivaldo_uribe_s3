describe('CRUD Usuarios Page', () => {
  beforeEach(() => {
    // Mock para obtener la lista de usuarios
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, nombre: 'Juan', apellidos: 'Pérez', tipoUsuario: 'admin', email: 'juan.perez@example.com' },
        { id: 2, nombre: 'Ana', apellidos: 'Gómez', tipoUsuario: 'user', email: 'ana.gomez@example.com' },
      ],
    });

    // Mock para actualizar un usuario
    cy.intercept('PUT', '/api/users/1', {
      statusCode: 200,
      body: { success: true },
    });

    // Mock para eliminar un usuario
    cy.intercept('DELETE', '/api/users/1', {
      statusCode: 200,
      body: { success: true },
    });

    // Visitar la página de gestión de usuarios
    cy.visit('/crud-usuarios');
  });

  it('should display a list of users', () => {
    // Verificar que los usuarios están listados
    cy.contains('Juan Pérez (admin)').should('be.visible');
    cy.contains('Ana Gómez (user)').should('be.visible');
  });

  it('should navigate to edit a user', () => {
    // Clic en el botón "Editar" para el primer usuario
    cy.contains('Editar').click();

    // Verificar que los datos del usuario están cargados en el formulario
    cy.get('ion-input[formControlName="nombre"]').should('have.value', 'Juan');
    cy.get('ion-input[formControlName="apellidos"]').should('have.value', 'Pérez');
    cy.get('ion-input[formControlName="email"]').should('have.value', 'juan.perez@example.com');
    cy.get('ion-select[formControlName="tipoUsuario"]').should('have.value', 'admin');
  });

  it('should save changes for a user', () => {
    // Clic en el botón "Editar" para el primer usuario
    cy.contains('Editar').click();

    // Editar los datos del usuario
    cy.get('ion-input[formControlName="nombre"]').clear().type('Carlos');
    cy.get('ion-input[formControlName="apellidos"]').clear().type('Ramírez');
    cy.get('ion-select[formControlName="tipoUsuario"]').select('user');

    // Guardar los cambios
    cy.get('ion-button[type="submit"]').click();

    // Verificar que el mock de guardar fue llamado correctamente
    cy.contains('Cambios guardados correctamente').should('be.visible');
  });

  it('should delete a user', () => {
    // Clic en el botón "Eliminar" para el primer usuario
    cy.contains('Eliminar').click();

    // Verificar que el mock de eliminación fue llamado
    cy.contains('Usuario eliminado correctamente').should('be.visible');

    // Verificar que el usuario ya no está en la lista
    cy.contains('Juan Pérez (admin)').should('not.exist');
  });

  it('should show validation errors on the edit form', () => {
    // Clic en el botón "Editar" para el primer usuario
    cy.contains('Editar').click();

    // Limpiar los campos obligatorios
    cy.get('ion-input[formControlName="nombre"]').clear().blur();
    cy.get('ion-input[formControlName="apellidos"]').clear().blur();

    // Verificar los mensajes de error
    cy.contains('Nombre es requerido.').should('be.visible');
    cy.contains('Apellidos son requeridos.').should('be.visible');

    // Verificar que el botón "Guardar Cambios" esté deshabilitado
    cy.get('ion-button[type="submit"]').should('be.disabled');
  });

  it('should cancel the edit process', () => {
    // Clic en el botón "Editar" para el primer usuario
    cy.contains('Editar').click();

    // Clic en "Cancelar"
    cy.get('ion-button').contains('Cancelar').click();

    // Verificar que vuelve a la lista de usuarios
    cy.contains('Users Management').should('be.visible');
    cy.contains('Juan Pérez (admin)').should('be.visible');
  });
});
