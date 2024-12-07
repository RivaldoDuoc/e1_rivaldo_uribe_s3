describe('API Libros Service', () => {
    beforeEach(() => {
      // Intercepta el llamado a la API de OpenLibrary
      cy.intercept('GET', '**/search.json*', (req) => {
        req.reply({
          statusCode: 200,
          body: {
            docs: [
              {
                title: 'Libro Prueba',
                author_name: ['Autor Prueba'],
                isbn: ['123456789'],
              },
            ],
          },
        });
      }).as('mockApiLibros');
    });
  
    it('debería simular la búsqueda de un libro por ISBN y mostrar resultados en la interfaz', () => {
      const terminoBusqueda = '123456789';
  
      // Visita la página de búsqueda (ajusta la ruta según tu configuración)
      cy.visit('/mis-lecturas');
  
      // Simula el ingreso del término de búsqueda
      cy.get('input[formcontrolname="datoBusqueda"]') // Asegúrate de usar el selector correcto
        .type(terminoBusqueda)
        .should('have.value', terminoBusqueda);
  
      // Simula el clic en el botón de búsqueda
      cy.get('ion-button[type="submit"]').click();
  
      // Espera a que se active el mock de la API
      cy.wait('@mockApiLibros').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
  
        // Verifica que los datos simulados coincidan
        const resultados = interception.response.body.docs;
        expect(resultados).to.have.length(1);
        expect(resultados[0].title).to.eq('Libro Prueba');
        expect(resultados[0].author_name[0]).to.eq('Autor Prueba');
        expect(resultados[0].isbn[0]).to.eq('123456789');
      });
  
      // Verifica que los datos simulados se muestren en la interfaz
      cy.contains('Libro Prueba').should('be.visible');
      cy.contains('Autor Prueba').should('be.visible');
    });
  });
  