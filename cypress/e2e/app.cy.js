describe('Página principal de la aplicación', () => {
    it('debería cargar la página principal', () => {
      cy.visit('http://localhost:4200'); 
      cy.contains('Bienvenido a ComentaLibros'); 
    });
  });
  