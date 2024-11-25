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
  private storageInitialized = false;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private dbService: DbService, // Servicio SQLite
    private storage: Storage // Almacenamiento de sesión
  ) {}

  async ngOnInit() {
    // Inicializar almacenamiento y base de datos
    await this.initializeStorage();
    await this.checkSession();
    await this.dbService.createDatabase();
  }

  // Inicializa el almacenamiento local
  async initializeStorage() {
    if (!this.storageInitialized) {
      await this.storage.create(); // Crear la instancia de almacenamiento
      this.storageInitialized = true;
    }
  }

  // Verifica la sesión actual para determinar si el usuario está logueado y su tipo
  async checkSession() {
    const currentUser = await this.storage.get('currentUser');
    if (currentUser) {
      this.isLoggedIn = true;
      this.isAdmin = currentUser.tipoUsuario === 'admin'; // Determina si es admin
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }

  cerrarMenu() {
    this.menuController.close(); // Cierra el menú lateral
  }

  // Cierra la sesión del usuario actual
  async logout() {
    console.log('Cerrando sesión...');
    this.cerrarMenu(); // Cierra el menú

    // Limpia la información de sesión
    await this.storage.remove('currentUser');
    this.isLoggedIn = false;
    this.isAdmin = false;

    // Redirige al login
    this.router.navigate(['/login']);
  }

  // Navegar a la página CRUD si el usuario es administrador
  navegarCRUD() {
    if (this.isAdmin) {
      this.router.navigate(['/crud-usuarios']);
    } else {
      console.error('Acceso denegado: solo administradores pueden acceder.');
    }
  }
}
