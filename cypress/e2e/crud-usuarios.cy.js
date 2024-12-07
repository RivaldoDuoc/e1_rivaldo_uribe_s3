describe('Gestión de Usuarios', () => {
  beforeEach(() => {
    // Visitar la página principal de gestión de usuarios
    cy.visit('http://localhost:8100/crud-usuarios');

    // Mock para datos iniciales
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, nombre: 'Rivaldo', apellidos: 'Uribe', tipoUsuario: 'admin', email: 'riv.uribe@duocuc.cl' },
        { id: 2, nombre: 'Juan', apellidos: 'Pérez', tipoUsuario: 'user', email: 'juan.perez@example.com' },
      ],
    }).as('getUsers');
  });

  it('Debería mostrar la lista de usuarios', () => {
    // Esperar que los usuarios se carguen
    cy.wait('@getUsers');

    // Verificar que se muestren los usuarios en la lista
    cy.get('ion-item').should('have.length', 2);
    cy.contains('Rivaldo Uribe (admin)').should('exist');
    cy.contains('Juan Pérez (user)').should('exist');
  });

  it('Debería permitir editar un usuario', () => {
    // Hacer clic en el botón "Editar" del primer usuario
    cy.contains('Editar').click();

    // Verificar que se muestre el formulario de edición
    cy.get('ion-input[formControlName="nombre"]').should('have.value', 'Rivaldo');

    // Modificar los datos del usuario
    cy.get('ion-input[formControlName="nombre"]').clear().type('Rivaldo Actualizado');
    cy.get('ion-input[formControlName="apellidos"]').clear().type('Uribe Actualizado');
    cy.get('ion-input[formControlName="password"]').type('123456');
    cy.get('ion-input[formControlName="confirmPassword"]').type('123456');
    cy.get('ion-select[formControlName="tipoUsuario"]').select('user');

    // Simular una respuesta al guardar
    cy.intercept('PUT', '/api/users/1', {
      statusCode: 200,
    }).as('updateUser');

    // Guardar los cambios
    cy.contains('Guardar Cambios').click();

    // Esperar que se guarden los cambios
    cy.wait('@updateUser');

    // Verificar que vuelva a la lista de usuarios
    cy.get('ion-item').should('exist');
    cy.contains('Rivaldo Actualizado Uribe Actualizado (user)').should('exist');
  });

  it('Debería permitir eliminar un usuario', () => {
    // Simular una respuesta al eliminar
    cy.intercept('DELETE', '/api/users/2', {
      statusCode: 200,
    }).as('deleteUser');

    // Hacer clic en el botón "Eliminar" del segundo usuario
    cy.contains('Juan Pérez (user)').parent().find('ion-button[color="danger"]').click();

    // Confirmar la eliminación
    cy.on('window:confirm', () => true);

    // Esperar que se elimine el usuario
    cy.wait('@deleteUser');

    // Verificar que el usuario ya no esté en la lista
    cy.get('ion-item').should('have.length', 1);
    cy.contains('Juan Pérez').should('not.exist');
  });
});
