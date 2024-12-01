import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbService } from './services/db.service'; // Servicio SQLite
import { Storage } from '@ionic/storage-angular'; // Manejo del estado de sesión

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAdmin: boolean = false; // Determina si el usuario es administrador
  isLoggedIn: boolean = false; // Determina si el usuario está autenticado
  private storageInitialized: boolean = false;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private dbService: DbService, // Servicio SQLite
    private storage: Storage // Almacenamiento de sesión
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Inicializar almacenamiento y base de datos
      await this.initializeStorage();
      await this.dbService.createDatabase();
      console.log('Base de datos inicializada correctamente.');

      // Verificar sesión activa
      await this.checkSession();
    } catch (error) {
      console.error('Error durante la inicialización de la aplicación:', error);
    }
  }

  // Inicializa el almacenamiento local
  async initializeStorage(): Promise<void> {
    if (!this.storageInitialized) {
      await this.storage.create(); // Crear la instancia de almacenamiento
      this.storageInitialized = true;
      console.log('Almacenamiento inicializado.');
    }
  }

  // Verifica la sesión actual para determinar si el usuario está logueado y su tipo
  async checkSession(): Promise<void> {
    try {
      const currentUser = await this.storage.get('currentUser');
      if (currentUser) {
        this.isLoggedIn = true;
        this.isAdmin = currentUser.tipoUsuario === 'admin'; // Determina si es admin
        console.log('Sesión activa:', currentUser);
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        console.log('No hay sesión activa.');
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    }
  }

  cerrarMenu(): void {
    this.menuController.close(); // Cierra el menú lateral
  }

  // Cierra la sesión del usuario actual
  async logout(): Promise<void> {
    try {
      console.log('Cerrando sesión...');
      this.cerrarMenu(); // Cierra el menú

      // Limpia la información de sesión
      await this.storage.remove('currentUser');
      this.isLoggedIn = false;
      this.isAdmin = false;

      // Redirige al login
      this.router.navigate(['/login']);
      console.log('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Navegar a la página CRUD si el usuario es administrador
  navegarCRUD(): void {
    if (this.isAdmin) {
      console.log('Accediendo al CRUD de usuarios.');
      this.router.navigate(['/crud-usuarios']);
    } else {
      console.error('Acceso denegado: solo administradores pueden acceder.');
    }
  }
}
