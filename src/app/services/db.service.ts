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

  async createDatabase() {
    try {
      // Crear conexión a la base de datos
      this.db = await this.sqlite.createConnection('appDB', false, 'no-encryption', 1, false);
      await this.db.open();

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

      // Crear tabla de libros con relación a usuarios
      const bookQuery = `
        CREATE TABLE IF NOT EXISTS libros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          autor TEXT NOT NULL,
          isbn TEXT UNIQUE NOT NULL,
          imagen TEXT NOT NULL,
          resena TEXT,
          valoracion INTEGER DEFAULT 0, -- Nueva columna para valoración
          comentarios TEXT, -- Nueva columna para comentarios
          usuarioId INTEGER NOT NULL, -- Relación con tabla de usuarios
          FOREIGN KEY (usuarioId) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
      await this.db.execute(bookQuery);

      console.log('Base de datos inicializada correctamente.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw new Error('Error al crear la base de datos.');
    }
  }

  // --------------------------------------
  // Métodos para manejar la tabla de usuarios
  // --------------------------------------

  async addUser(nombre: string, apellidos: string, fechaNacimiento: string, email: string, password: string, tipoUsuario: string) {
    try {
      const query = `
        INSERT INTO users (nombre, apellidos, fechaNacimiento, email, password, tipoUsuario) 
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await this.db?.run(query, [nombre, apellidos, fechaNacimiento, email, password, tipoUsuario]);
      console.log('Usuario agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw new Error('No se pudo agregar el usuario.');
    }
  }

  async getUserByEmail(email: string) {
    try {
      const query = `SELECT * FROM users WHERE email = ?;`;
      const result = await this.db?.query(query, [email]);
      return result?.values?.[0] || null;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw new Error('No se pudo encontrar el usuario.');
    }
  }
  
  async getAllUsers() {
    try {
      const query = `SELECT * FROM users;`;
      const result = await this.db?.query(query);
      return result?.values || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('No se pudieron obtener los usuarios.');
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
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
      const query = `
        INSERT INTO libros (titulo, autor, isbn, imagen, resena, valoracion, comentarios, usuarioId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const params = [
        libro.titulo,
        libro.autor,
        libro.isbn,
        libro.imagen,
        libro.resena,
        libro.valoracion || 0,
        libro.comentarios || '',
        usuarioId,
      ];
      await this.db?.run(query, params);
      console.log('Libro agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar libro:', error);
      throw new Error('No se pudo agregar el libro.');
    }
  }
  
  async obtenerLibros(usuarioId: number): Promise<any[]> {
    try {
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
        UPDATE libros SET titulo = ?, autor = ?, imagen = ?, resena = ?, valoracion = ?, comentarios = ? 
        WHERE isbn = ?;
      `;
      const params = [
        libro.titulo,
        libro.autor,
        libro.imagen,
        libro.resena,
        libro.valoracion,
        libro.comentarios,
        libro.isbn,
      ];
      await this.db?.run(query, params);
      console.log('Libro actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      throw new Error('No se pudo actualizar el libro.');
    }
  }

  async obtenerLibroPorISBN(isbn: string): Promise<any> {
    try {
      const query = `SELECT * FROM libros WHERE isbn = ?;`;
      const result = await this.db?.query(query, [isbn]);
      return result?.values?.[0] || null;
    } catch (error) {
      console.error('Error al obtener libro por ISBN:', error);
      throw new Error('No se pudo encontrar el libro.');
    }
  }


  
}
