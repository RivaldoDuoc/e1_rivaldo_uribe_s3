describe('Página Mis Lecturas', () => {
  beforeEach(() => {
    // Mock para simular datos de SQLite
    cy.intercept('GET', '**/db-service', {
      statusCode: 200,
      body: [
        {
          titulo: 'Libro de Ejemplo 1',
          autor: 'Autor Ejemplo',
          isbn: '123456789',
          imagen: 'url-ejemplo.jpg',
        },
        {
          titulo: 'Libro de Ejemplo 2',
          autor: 'Otro Autor',
          isbn: '987654321',
          imagen: 'url-ejemplo2.jpg',
        },
      ],
    }).as('getLibros');

    cy.visit('http://localhost:8100/mis-lecturas'); // URL de la página
  });

  it('Debería mostrar el título de la página', () => {
    cy.get('ion-title').should('contain', 'Mis Lecturas'); // Verifica que el título sea correcto
  });

  it('Debería cargar la lista de lecturas correctamente', () => {
    cy.wait('@getLibros'); // Espera la respuesta simulada
    cy.get('ion-card').should('have.length', 2); // Verifica que se cargaron los libros
  });

  it('Debería permitir buscar un libro por título', () => {
    cy.get('ion-input[formcontrolname="datoBusqueda"]').type('Libro de Ejemplo 1');
    cy.get('ion-button[type="submit"]').click();
    cy.get('ion-card').should('contain', 'Libro de Ejemplo 1');
  });

  it('Debería mostrar un mensaje de error si no se encuentra un libro', () => {
    cy.get('ion-input[formcontrolname="datoBusqueda"]').type('Libro Inexistente');
    cy.get('ion-button[type="submit"]').click();
    cy.get('ion-text[color="danger"]').should('contain', 'No se encontraron resultados.');
  });

  it('Debería permitir eliminar un libro', () => {
    cy.get('ion-card').first().within(() => {
      cy.get('ion-button[color="danger"]').click();
    });
    cy.get('ion-card').should('have.length', 1); // Verifica que se eliminó un libro
  });

  it('Debería abrir un modal para editar un libro', () => {
    cy.get('ion-card').first().click(); // Simula clic en un libro
    cy.get('ion-modal').should('be.visible'); // Verifica que se abre el modal
  });
});
