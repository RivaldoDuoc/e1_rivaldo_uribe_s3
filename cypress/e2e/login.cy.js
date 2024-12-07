describe('Página de Inicio de Sesión', () => {
  beforeEach(() => {
    // Simulación de todos los métodos relacionados con SQLite
    cy.intercept('POST', '/api/login', (req) => {
      const { email, password } = req.body;
      // Simulación para un administrador
      if (email === 'admin@ejemplo.com' && password === 'admin123') {
        req.reply({
          statusCode: 200,
          body: { success: true, tipoUsuario: 'admin' },
        });
      }
      // Simulación para un usuario normal
      else if (email === 'usuario@ejemplo.com' && password === 'password123') {
        req.reply({
          statusCode: 200,
          body: { success: true, tipoUsuario: 'user' },
        });
      }
      // Simulación de error para credenciales incorrectas
      else {
        req.reply({
          statusCode: 401,
          body: { success: false, message: 'Usuario o contraseña incorrectos.' },
        });
      }
    });

    // Visitar la página de inicio de sesión
    cy.visit('/');

    // Asegurar que no exista un elemento que bloquee la interacción
    cy.get('ion-backdrop').should('not.exist');
  });

  it('Debería mostrar la página de inicio de sesión', () => {
    cy.contains('Iniciar Sesión').should('be.visible');
  });

  it('Debería mostrar error si los campos están vacíos', () => {
    cy.get('ion-button').contains('Entrar').click();
    cy.contains('Debe ingresar un e-mail válido.').should('be.visible');
  });

  it('Debería mostrar error si el formato del correo es inválido', () => {
    cy.get('ion-input[type="email"] input').type('usuario@ejemplo');
    cy.get('ion-button').contains('Entrar').click();
    cy.contains('Formato de e-mail inválido.').should('be.visible');
  });

  it('Debería mostrar error si la contraseña es muy corta o larga', () => {
    cy.get('ion-input[type="email"] input').type('usuario@ejemplo.com');

    // Contraseña corta
    cy.get('ion-input[type="password"] input').type('123');
    cy.get('ion-button').contains('Entrar').click();
    cy.contains('La contraseña debe tener entre 4 y 6 caracteres.').should('be.visible');

    // Contraseña larga
    cy.get('ion-input[type="password"] input').clear().type('1234567');
    cy.get('ion-button').contains('Entrar').click();
    cy.contains('La contraseña debe tener entre 4 y 6 caracteres.').should('be.visible');
  });

  it('Debería permitir iniciar sesión con credenciales correctas y redirigir al home', () => {
    cy.get('ion-input[type="email"] input').type('usuario@ejemplo.com');
    cy.get('ion-input[type="password"] input').type('password123');
    cy.get('ion-button').contains('Entrar').click();
    cy.url().should('include', '/home');
  });

  it('Debería permitir iniciar sesión como administrador y redirigir al CRUD de usuarios', () => {
    cy.get('ion-input[type="email"] input').type('admin@ejemplo.com');
    cy.get('ion-input[type="password"] input').type('admin123');
    cy.get('ion-button').contains('Entrar').click();
    cy.url().should('include', '/crud-usuarios');
  });

  it('Debería mostrar error con credenciales incorrectas', () => {
    cy.get('ion-input[type="email"] input').type('usuario@ejemplo.com');
    cy.get('ion-input[type="password"] input').type('wrongpassword');
    cy.get('ion-button').contains('Entrar').click();
    cy.contains('Usuario o contraseña incorrectos.').should('be.visible');
  });

  it('Debería navegar a la página de recuperación de contraseña', () => {
    cy.get('ion-button').contains('Recuperar Contraseña').click();
    cy.url().should('include', '/recuperar-contrasena');
  });

  it('Debería navegar a la página de registro', () => {
    cy.get('ion-button').contains('Registro').click();
    cy.url().should('include', '/mi-perfil?registro=true');
    cy.contains('Registro de Usuario').should('be.visible');
  });
});
