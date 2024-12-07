describe('Home Page', () => {
  beforeEach(() => {
    // Mock de libros iniciales
    cy.intercept('GET', '/assets/data/libros.json', {
      statusCode: 200,
      body: [
        { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', isbn: '123456789', imagen: 'assets/img/principito.jpg' },
        { titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', isbn: '987654321', imagen: 'assets/img/cien-anos.jpg' },
        { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', isbn: '1122334455', imagen: 'assets/img/don-quijote.jpg' },
      ],
    });

    // Visitar la página de inicio
    cy.visit('/');
  });

  it('should display the header with the logo and menu button', () => {
    // Verificar que el logo y el botón de menú son visibles
    cy.get('.logo').should('be.visible');
    cy.get('ion-menu-button').should('be.visible');
  });

  it('should display the search bar', () => {
    // Verificar que el buscador esté presente
    cy.get('ion-searchbar').should('be.visible');
  });

  it('should display categories in the segment', () => {
    // Verificar que las categorías están disponibles
    cy.get('ion-segment-button').contains('+ Valorados').should('be.visible');
    cy.get('ion-segment-button').contains('+ Recientes').should('be.visible');
    cy.get('ion-segment-button').contains('Populares').should('be.visible');
    cy.get('ion-segment-button').contains('Recomendados').should('be.visible');
    cy.get('ion-segment-button').contains('Clásicos').should('be.visible');
  });

  it('should display the list of books', () => {
    // Verificar que los libros se muestran correctamente
    cy.contains('El Principito').should('be.visible');
    cy.contains('Antoine de Saint-Exupéry').should('be.visible');
    cy.contains('Cien Años de Soledad').should('be.visible');
    cy.contains('Gabriel García Márquez').should('be.visible');
  });

  it('should filter books based on search input', () => {
    // Escribir en el buscador
    cy.get('ion-searchbar').type('Cien Años');

    // Verificar que solo se muestra el libro filtrado
    cy.contains('El Principito').should('not.exist');
    cy.contains('Cien Años de Soledad').should('be.visible');
  });

  it('should filter books based on selected category', () => {
    // Seleccionar la categoría "Populares"
    cy.get('ion-segment-button').contains('Populares').click();

    // Verificar que se actualiza la lista de libros según la categoría
    cy.contains('Don Quijote de la Mancha').should('be.visible');
    cy.contains('El Principito').should('not.exist');
  });

  it('should navigate to book details on click', () => {
    // Clic en un libro
    cy.contains('El Principito').click();

    // Verificar que redirige a la página de detalles
    cy.url().should('include', '/detalle-libro');
    cy.contains('El Principito').should('be.visible');
  });
});
