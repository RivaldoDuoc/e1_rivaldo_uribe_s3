import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from '../services/db.service'; // Servicio SQLite
import { Storage } from '@ionic/storage-angular'; // Para manejar la sesión

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading: boolean = false;
  email: string = ''; // Variable para almacenar el correo electrónico
  password: string = ''; // Variable para almacenar la contraseña

  constructor(
    private router: Router,
    private alertController: AlertController,
    private dbService: DbService, // Servicio SQLite
    private storage: Storage // Manejo de sesión
  ) {}

  // Método para mostrar una alerta de error
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Función para validar el formato del correo electrónico
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método de inicio de sesión con validaciones
  async login() {
    if (!this.email) {
      this.mostrarAlerta('Debe ingresar un e-mail válido.');
      return;
    }
  
    if (!this.validarEmail(this.email)) {
      this.mostrarAlerta('Formato de e-mail inválido.');
      return;
    }
  
    if (!this.password) {
      this.mostrarAlerta('Debe ingresar una contraseña.');
      return;
    }
  
    if (this.password.length < 4 || this.password.length > 6) {
      this.mostrarAlerta('La contraseña debe tener entre 4 y 6 caracteres.');
      return;
    }
  
    // Validar usuario en la base de datos
    this.loading = true;
    const user = await this.dbService.getUserByEmail(this.email);
    this.loading = false;
  
    if (user && user.password === this.password) {
      // Guardar el usuario en el almacenamiento local y en Storage
      localStorage.setItem('usuarioEmail', this.email); // Guarda en localStorage
      await this.storage.set('usuarioEmail', this.email); // Guarda en Storage (persistente)
      await this.storage.set('currentUser', user); // Guarda el objeto completo en Storage

      // Redirigir según el tipo de usuario
      if (user.tipoUsuario === 'admin') {
        this.router.navigate(['/crud-usuarios']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      this.mostrarAlerta('Usuario o contraseña incorrectos.');
    }
  }

  irARegistro() {
    this.router.navigate(['/mi-perfil']);
  }
}
