describe('Editar Libro - E2E', () => {
  beforeEach(() => {
    // Configura el mock del servidor para simular la API y la base de datos
    cy.intercept('POST', '/guardarLibro', {
      statusCode: 200,
      body: { success: true },
    }).as('guardarLibroMock');

    cy.intercept('POST', '/eliminarLibro', {
      statusCode: 200,
      body: { success: true },
    }).as('eliminarLibroMock');

    // Navega a la página de edición del libro
    cy.visit('/editar-libro');
  });

  it('Debería mostrar la página de edición del libro', () => {
    cy.get('ion-title').should('contain', 'Editar Libro');
    cy.get('form').should('exist');
  });

  it('Debería permitir guardar cambios en el libro', () => {
    cy.get('ion-input[formControlName="titulo"]').clear().type('Nuevo Título');
    cy.get('ion-input[formControlName="autor"]').clear().type('Nuevo Autor');
    cy.get('ion-input[formControlName="isbn"]').should('have.attr', 'readonly'); // ISBN es de solo lectura
    cy.get('ion-select[formControlName="categoria"]').click();
    cy.get('ion-select-option').contains('Narrativos').click();

    cy.get('ion-button').contains('Guardar').click();

    // Verifica que se envió la solicitud al mock
    cy.wait('@guardarLibroMock').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.success).to.eq(true);
    });
  });

  it('Debería permitir eliminar el libro', () => {
    cy.get('ion-button').contains('Eliminar').click();

    // Verifica que se envió la solicitud al mock
    cy.wait('@eliminarLibroMock').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.success).to.eq(true);
    });
  });

  it('Debería permitir cancelar y regresar sin guardar cambios', () => {
    cy.get('ion-button').contains('Cancelar').click();
    cy.url().should('not.include', '/editar-libro');
  });
});
