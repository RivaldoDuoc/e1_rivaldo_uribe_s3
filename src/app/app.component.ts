import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menuController: MenuController, private router: Router) {}

  cerrarMenu() {
    this.menuController.close(); // Cierra el menú cuando se selecciona una opción
  }

  logout() {
    // Lógica para cerrar sesión, por ejemplo, eliminar token o limpiar datos
    console.log('Cerrando sesión...');
    this.cerrarMenu(); // Cierra el menú

    // Redirige a la página de login
    this.router.navigate(['/login']);
  }
}
