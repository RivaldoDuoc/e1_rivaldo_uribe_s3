describe('Edición de Libros', () => {
    beforeEach(() => {
      cy.visit('/editar-libro'); // Cambia esta URL según tu configuración
    });
  
    it('Debería mostrar mensajes de validación para campos requeridos', () => {
      cy.get('ion-input[formControlName="titulo"]').focus().blur();
      cy.contains('Título es requerido').should('exist');
      cy.get('ion-input[formControlName="autor"]').focus().blur();
      cy.contains('Autor es requerido').should('exist');
    });
  
    it('Debería guardar cambios correctamente', () => {
      cy.get('ion-input[formControlName="titulo"]').type('Libro Actualizado');
      cy.get('ion-input[formControlName="autor"]').type('Autor Actualizado');
      cy.get('ion-textarea[formControlName="resena"]').type('Nueva reseña para el libro.');
      cy.get('ion-button').contains('Guardar').click();
      cy.contains('Cambios guardados').should('exist'); // Cambia según tu mensaje de confirmación
    });
  
    it('Debería confirmar antes de eliminar un libro', () => {
      cy.get('ion-button').contains('Eliminar').click();
      cy.contains('¿Estás seguro de eliminar este libro?').should('exist'); // Cambia según el texto del diálogo
    });
  });
  