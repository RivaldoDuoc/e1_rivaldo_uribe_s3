/// <reference types="cypress" />

describe('Pruebas E2E para ConfirmacionDialogComponent', () => {
    beforeEach(() => {
      // Visita la página principal donde se carga el componente
      cy.visit('/'); // Ajusta la ruta según dónde se encuentra tu componente
    });
  
    it('Debería mostrar el título y mensaje correctamente', () => {
      // Simula la apertura del diálogo con datos específicos
      cy.window().then((win) => {
        win.openConfirmacionDialog({
          titulo: 'Eliminar Item',
          mensaje: '¿Estás seguro de eliminar este elemento?',
        });
      });
  
      // Verifica que el título y mensaje del diálogo son correctos
      cy.get('h2[mat-dialog-title]').should('contain', 'Eliminar Item');
      cy.get('mat-dialog-content p').should('contain', '¿Estás seguro de eliminar este elemento?');
    });
  
    it('Debería cerrar el diálogo al presionar "Cancelar"', () => {
      cy.window().then((win) => {
        win.openConfirmacionDialog({
          titulo: 'Eliminar Item',
          mensaje: '¿Estás seguro de eliminar este elemento?',
        });
      });
  
      // Simula clic en el botón "Cancelar"
      cy.get('button').contains('Cancelar').click();
  
      // Verifica que el diálogo ya no está presente en el DOM
      cy.get('mat-dialog-content').should('not.exist');
    });
  
    it('Debería confirmar la acción al presionar "Aceptar"', () => {
      cy.window().then((win) => {
        win.openConfirmacionDialog({
          titulo: 'Eliminar Item',
          mensaje: '¿Estás seguro de eliminar este elemento?',
        });
      });
  
      // Simula clic en el botón "Aceptar"
      cy.get('button').contains('Aceptar').click();
  
      // Verifica que el diálogo ya no está presente en el DOM
      cy.get('mat-dialog-content').should('not.exist');
  
      // Simula comportamiento tras confirmación (puedes adaptarlo según tu implementación)
      cy.window().its('onConfirmarCallback').should('have.been.called');
    });
  });
  