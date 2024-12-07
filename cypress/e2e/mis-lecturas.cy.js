describe('Editar Libro Page', () => {
  beforeEach(() => {
    // Mock para cargar los datos del libro desde SQLite
    cy.intercept('GET', '/api/libros/123456789', {
      statusCode: 200,
      body: {
        titulo: 'Libro de Prueba',
        autor: 'Autor Prueba',
        isbn: '123456789',
        resena: 'Esta es una reseña de prueba',
        valoracion: 4.5,
        comentarios: 'Un comentario de ejemplo',
        imagen: 'assets/img/example-book.jpg',
      },
    });

    // Mock para guardar los cambios del libro
    cy.intercept('PUT', '/api/libros/123456789', {
      statusCode: 200,
      body: { success: true },
    });

    // Mock para eliminar el libro
    cy.intercept('DELETE', '/api/libros/123456789', {
      statusCode: 200,
      body: { success: true },
    });

    // Visitar la página de edición de libro
    cy.visit('/editar-libro/123456789');
  });

  it('should display the book details', () => {
    // Verifica que los datos del libro se cargan correctamente
    cy.get('ion-input[formControlName="titulo"]').should('have.value', 'Libro de Prueba');
    cy.get('ion-input[formControlName="autor"]').should('have.value', 'Autor Prueba');
    cy.get('ion-input[formControlName="isbn"]').should('have.value', '123456789');
    cy.get('ion-textarea[formControlName="resena"]').should('have.value', 'Esta es una reseña de prueba');
    cy.get('ion-range[formControlName="valoracion"]').should('have.value', '4.5');
    cy.get('ion-textarea[formControlName="comentarios"]').should('have.value', 'Un comentario de ejemplo');
  });

  it('should allow editing and saving book details', () => {
    // Editar los campos del formulario
    cy.get('ion-input[formControlName="titulo"]').clear().type('Nuevo Título');
    cy.get('ion-input[formControlName="autor"]').clear().type('Nuevo Autor');
    cy.get('ion-textarea[formControlName="resena"]').clear().type('Reseña actualizada');
    cy.get('ion-range[formControlName="valoracion"]').invoke('val', '5').trigger('change');
    cy.get('ion-textarea[formControlName="comentarios"]').clear().type('Comentarios actualizados');

    // Guardar los cambios
    cy.get('ion-button').contains('Guardar').click();

    // Verificar que la operación se completó exitosamente
    cy.contains('Cambios guardados correctamente').should('be.visible');
  });

  it('should allow deleting the book', () => {
    // Clic en el botón "Eliminar"
    cy.get('ion-button').contains('Eliminar').click();

    // Verificar que el libro fue eliminado correctamente
    cy.contains('Libro eliminado correctamente').should('be.visible');

    // Asegurarse de que redirige a la lista de libros
    cy.url().should('include', '/mis-lecturas');
  });

  it('should cancel and go back to the previous page', () => {
    // Clic en el botón "Cancelar"
    cy.get('ion-button').contains('Cancelar').click();

    // Verifica que vuelve a la página anterior
    cy.url().should('not.include', '/editar-libro');
  });
});
