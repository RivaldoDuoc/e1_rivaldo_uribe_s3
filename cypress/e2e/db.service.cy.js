describe('DbService E2E Tests', () => {
    let mockDbService;
  
    beforeEach(() => {
      // Mock de los métodos del servicio
      mockDbService = {
        initializeDatabase: cy.stub().resolves(),
        agregarUsuario: cy.stub().resolves({ id: 1, nombre: 'Test User', email: 'test@user.com' }),
        getUserByEmail: cy.stub().resolves({ id: 1, nombre: 'Test User', email: 'test@user.com' }),
        eliminarUsuario: cy.stub().resolves(true),
        agregarLibro: cy.stub().resolves({ id: 1, titulo: 'Nuevo Libro', autor: 'Autor Prueba', isbn: '123456789' }),
        obtenerLibros: cy.stub().resolves([
          { id: 1, titulo: 'Libro 1', autor: 'Autor 1', isbn: '111111111' },
          { id: 2, titulo: 'Libro 2', autor: 'Autor 2', isbn: '222222222' },
        ]),
        eliminarLibro: cy.stub().resolves(true),
      };
    });
  
    it('Debería inicializar la base de datos correctamente', () => {
      mockDbService.initializeDatabase().then(() => {
        expect(mockDbService.initializeDatabase).to.have.been.calledOnce;
      });
    });
  
    it('Debería agregar un usuario correctamente', () => {
      const nuevoUsuario = { nombre: 'Nuevo Usuario', email: 'nuevo@usuario.com', tipo: 'admin' };
  
      mockDbService.agregarUsuario(nuevoUsuario).then((resultado) => {
        expect(resultado).to.have.property('id');
        expect(resultado.nombre).to.equal('Test User');
      });
  
      expect(mockDbService.agregarUsuario).to.have.been.calledOnceWith(nuevoUsuario);
    });
  
    it('Debería obtener un usuario por email', () => {
      const email = 'test@user.com';
  
      mockDbService.getUserByEmail(email).then((usuario) => {
        expect(usuario).to.have.property('nombre', 'Test User');
        expect(usuario.email).to.equal(email);
      });
  
      expect(mockDbService.getUserByEmail).to.have.been.calledOnceWith(email);
    });
  
    it('Debería agregar un libro correctamente', () => {
      const nuevoLibro = { titulo: 'Nuevo Libro', autor: 'Autor Prueba', isbn: '123456789' };
  
      mockDbService.agregarLibro(nuevoLibro).then((resultado) => {
        expect(resultado).to.have.property('id');
        expect(resultado.titulo).to.equal('Nuevo Libro');
      });
  
      expect(mockDbService.agregarLibro).to.have.been.calledOnceWith(nuevoLibro);
    });
  
    it('Debería obtener todos los libros', () => {
      mockDbService.obtenerLibros().then((libros) => {
        expect(libros).to.have.lengthOf(2);
        expect(libros[0]).to.have.property('titulo', 'Libro 1');
      });
  
      expect(mockDbService.obtenerLibros).to.have.been.calledOnce;
    });
  
    it('Debería eliminar un libro correctamente', () => {
      const libroId = 1;
  
      mockDbService.eliminarLibro(libroId).then((resultado) => {
        expect(resultado).to.be.true;
      });
  
      expect(mockDbService.eliminarLibro).to.have.been.calledOnceWith(libroId);
    });
  
    it('Debería eliminar un usuario correctamente', () => {
      const userId = 1;
  
      mockDbService.eliminarUsuario(userId).then((resultado) => {
        expect(resultado).to.be.true;
      });
  
      expect(mockDbService.eliminarUsuario).to.have.been.calledOnceWith(userId);
    });
  });
  