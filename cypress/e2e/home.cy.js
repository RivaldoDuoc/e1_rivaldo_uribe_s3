describe('Página de Inicio - Home', () => {
  const mockLibros = [
    {
      titulo: 'Libro Prueba 1',
      autor: 'Autor Prueba 1',
      isbn: '1234567890',
      categoria: 'Narrativos',
      valoracion: 5,
      imagen: '',
    },
    {
      titulo: 'Libro Prueba 2',
      autor: 'Autor Prueba 2',
      isbn: '0987654321',
      categoria: 'Infantil-juvenil',
      valoracion: 4,
      imagen: '',
    },
  ];

  beforeEach(() => {
    cy.visit('http://localhost:8100/home');

    // Mock para cargar libros desde la base de datos simulada
    cy.intercept('GET', '/api/libros', { body: mockLibros }).as('getLibros');
  });

  it('Debería mostrar los libros correctamente al inicio', () => {
    cy.wait('@getLibros');

    // Verificar que se muestren los libros mockeados
    cy.get('.libro-card').should('have.length', 2);
    cy.get('.libro-card').first().within(() => {
      cy.contains('Libro Prueba 1');
      cy.contains('Autor: Autor Prueba 1');
      cy.contains('Categoría: Narrativos');
    });
  });

  it('Debería filtrar libros por categoría', () => {
    // Cambiar la categoría seleccionada
    cy.get('ion-segment-button[value="Narrativos"]').click();

    // Simular el filtrado (en este caso se mostrarían solo los libros de la categoría Narrativos)
    cy.get('.libro-card').should('have.length', 1);
    cy.contains('Libro Prueba 1');
  });

  it('Debería buscar un libro por título', () => {
    cy.get('ion-searchbar input').type('Prueba 1');
    
    // Simular la búsqueda por título
    cy.get('.libro-card').should('have.length', 1);
    cy.contains('Libro Prueba 1');
  });

  it('Debería mostrar un mensaje si no hay libros disponibles en la categoría', () => {
    // Cambiar a una categoría vacía
    cy.get('ion-segment-button[value="Otras categorías"]').click();

    // Simular el comportamiento con categoría vacía
    cy.get('ion-text p').should('contain', 'No hay libros disponibles en esta categoría.');
  });
});
