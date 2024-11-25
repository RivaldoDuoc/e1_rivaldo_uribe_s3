import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private storage: Storage) {}

  async canActivate(): Promise<boolean> {
    // Recuperar el usuario actual desde el almacenamiento
    const currentUser = await this.storage.get('currentUser');
    if (currentUser?.tipoUsuario === 'admin') {
      return true; // Permitir acceso si es administrador
    }

    // Redirigir a la página principal si no es administrador
    this.router.navigate(['/home']);
    return false;
  }
}
