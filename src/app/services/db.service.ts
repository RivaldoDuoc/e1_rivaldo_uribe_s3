import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  // Inicializa y crea la base de datos si no está lista
  async createDatabase(): Promise<void> {
    try {
      console.log('Iniciando conexión con SQLite...');
      this.db = await this.sqlite.createConnection('appDBSQLite', false, 'no-encryption', 1, false);
      await this.db.open();
      console.log('Conexión SQLite abierta.');

      // Crear tabla de usuarios
      const userQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          fechaNacimiento TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          tipoUsuario TEXT NOT NULL
        );
      `;
      await this.db.execute(userQuery);
      console.log('Tabla de usuarios creada/verificada.');

      // Crear tabla de libros
      const bookQuery = `
        CREATE TABLE IF NOT EXISTS libros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          autor TEXT NOT NULL,
          isbn TEXT UNIQUE NOT NULL,
          imagen TEXT NOT NULL,
          resena TEXT,
          valoracion INTEGER DEFAULT 0,
          comentarios TEXT,
          usuarioId INTEGER NOT NULL,
          FOREIGN KEY (usuarioId) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
      await this.db.execute(bookQuery);
      console.log('Tabla de libros creada/verificada.');

      // Asegurar que el campo categoría exista
      const alterTableQuery = `
            ALTER TABLE libros ADD COLUMN categoria TEXT DEFAULT 'Otras categorías';
          `;
      try {
        await this.db.execute(alterTableQuery);
        console.log('Campo categoría agregado/verificado en la tabla de libros.');
      } catch (error) {
        console.log('Campo categoría ya existe.');
      }


    } catch (error: any) {
      console.error('Error al inicializar la base de datos:', error.message || error);

      // Intentar cerrar la conexión si algo falla
      if (this.db) {
        try {
          await this.sqlite.closeConnection('appDBSQLite', false);
          console.log('Conexión cerrada tras fallo.');
        } catch (closeError: any) {
          console.error('Error al cerrar la conexión tras fallo:', closeError.message || closeError);
        }
      }

      throw error; // Re-lanzar el error para manejarlo en la llamada superior
    }
  }

  // Asegura que la base de datos está inicializada antes de operar
  async initializeDatabase(): Promise<void> {
    if (!this.db) {
      console.log('Inicializando base de datos...');
      await this.createDatabase();
    }
  }

  // --------------------------------------
  // Métodos para manejar la tabla de usuarios
  // --------------------------------------

  async addUser(nombre: string, apellidos: string, fechaNacimiento: string, email: string, password: string, tipoUsuario: string): Promise<void> {
    try {
      await this.initializeDatabase();
      const query = `
        INSERT INTO users (nombre, apellidos, fechaNacimiento, email, password, tipoUsuario)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await this.db?.run(query, [nombre, apellidos, fechaNacimiento, email, password, tipoUsuario]);
      console.log('Usuario agregado correctamente en SQLite.');
    } catch (error: any) {
      console.error('Error en addUser:', error.message || error);
      if (error.message?.includes('UNIQUE constraint failed')) {
        throw new Error('El email ya está registrado.');
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      await this.initializeDatabase();
      const query = `SELECT * FROM users WHERE email = ?;`;
      const result = await this.db?.query(query, [email]);
      console.log('Usuario encontrado:', result?.values?.[0]);
      return result?.values?.[0] || null;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw new Error('No se pudo encontrar el usuario.');
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      await this.initializeDatabase();
      const query = `SELECT * FROM users;`;
      const result = await this.db?.query(query);
      console.log('Usuarios obtenidos:', result?.values);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('No se pudieron obtener los usuarios.');
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.initializeDatabase();
      const query = `DELETE FROM users WHERE id = ?;`;
      await this.db?.run(query, [userId]);
      console.log('Usuario eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error('No se pudo eliminar el usuario.');
    }
  }

  async updateUser(userId: number, nombre: string, apellidos: string, fechaNacimiento: string, email: string, password: string, tipoUsuario: string): Promise<void> {
    try {
      await this.initializeDatabase();
      const query = `
        UPDATE users SET nombre = ?, apellidos = ?, fechaNacimiento = ?, email = ?, password = ?, tipoUsuario = ? 
        WHERE id = ?;
      `;
      await this.db?.run(query, [nombre, apellidos, fechaNacimiento, email, password, tipoUsuario, userId]);
      console.log('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('No se pudo actualizar el usuario.');
    }
  }

  async countAdmins(): Promise<number> {
    try {
      await this.initializeDatabase();
      const query = `SELECT COUNT(*) as adminCount FROM users WHERE tipoUsuario = 'admin';`;
      const result = await this.db?.query(query);
      return result?.values?.[0]?.adminCount || 0;
    } catch (error) {
      console.error('Error al contar administradores:', error);
      throw new Error('No se pudo contar los administradores.');
    }
  }

  // --------------------------------------
  // Métodos para manejar la tabla de libros
  // --------------------------------------

  async agregarLibro(libro: any, usuarioId: number): Promise<void> {
    try {
      await this.initializeDatabase();
      const query = `
        INSERT INTO libros (titulo, autor, isbn, imagen, resena, valoracion, comentarios, usuarioId, categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.db?.run(query, [
        libro.titulo,
        libro.autor,
        libro.isbn,
        libro.imagen,
        libro.resena || '',
        libro.valoracion || 0,
        libro.comentarios || '',
        usuarioId,
        libro.categoria || 'Otras categorías',
      ]);
      console.log('Libro agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar libro:', error);
      throw new Error('No se pudo agregar el libro.');
    }
  }

  async obtenerLibros(usuarioId: number): Promise<any[]> {
    try {
      await this.initializeDatabase();
      const query = `SELECT * FROM libros WHERE usuarioId = ?;`;
      const result = await this.db?.query(query, [usuarioId]);
      console.log('Libros obtenidos para el usuario:', result?.values);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener libros:', error);
      throw new Error('No se pudieron obtener los libros.');
    }
  }

  async eliminarLibro(isbn: string): Promise<void> {
    try {
      await this.initializeDatabase();
      const query = `DELETE FROM libros WHERE isbn = ?;`;
      await this.db?.run(query, [isbn]);
      console.log('Libro eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      throw new Error('No se pudo eliminar el libro.');
    }
  }

  async actualizarLibro(libro: any): Promise<void> {
    try {
      const query = `
        UPDATE libros 
        SET titulo = ?, autor = ?, resena = ?, valoracion = ?, comentarios = ?, imagen = ?, categoria = ?
        WHERE isbn = ?;
      `;
      const params = [
        libro.titulo,
        libro.autor,
        libro.resena,
        libro.valoracion,
        libro.comentarios,
        libro.imagen,
        libro.categoria, // Nuevo campo
        libro.isbn,
      ];
      await this.db?.run(query, params);
      console.log('Libro actualizado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      throw error;
    }
  }
  
  
  async obtenerLibrosPorCategoria(categoria: string): Promise<any[]> {
    try {
      await this.initializeDatabase();
      const query = `SELECT * FROM libros WHERE categoria = ? ORDER BY id ASC;`;
      const result = await this.db?.query(query, [categoria]);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener libros por categoría:', error);
      throw new Error('No se pudieron obtener los libros.');
    }
  }
  
  async obtenerMejoresValorados(): Promise<any[]> {
    try {
      await this.initializeDatabase();
      // Seleccionar solo los 6 libros con la mejor valoración
      const query = `SELECT * FROM libros ORDER BY valoracion DESC LIMIT 6;`;
      const result = await this.db?.query(query);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener mejores valorados:', error);
      throw new Error('No se pudieron obtener los libros.');
    }
  }

  async obtenerTodosLibros(): Promise<any[]> {
    try {
      await this.initializeDatabase();
      const query = `SELECT * FROM libros ORDER BY id ASC;`; 
      const result = await this.db?.query(query);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener todos los libros:', error);
      throw new Error('No se pudieron obtener los libros.');
    }
  }

  async buscarLibros(query: string): Promise<any[]> {
    try {
      await this.initializeDatabase();
      const querySQL = `
        SELECT * FROM libros 
        WHERE LOWER(titulo) LIKE ? OR LOWER(autor) LIKE ? OR isbn LIKE ? OR LOWER(categoria) LIKE ?;
      `;
      const parametros = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
      const result = await this.db?.query(querySQL, parametros);
      return result?.values || [];
    } catch (error) {
      console.error('Error al buscar libros en la base de datos:', error);
      throw new Error('No se pudo realizar la búsqueda en la base de datos.');
    }
  }
  
  

}
