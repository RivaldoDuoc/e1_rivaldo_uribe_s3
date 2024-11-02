import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading: boolean = false;
  email: string = '';  // Variable para almacenar el correo electrónico
  password: string = '';  // Variable para almacenar la contraseña

  constructor(private router: Router, private alertController: AlertController) {}  // Inyección del enrutador y controlador de alertas

  irARegistro() {
    this.router.navigate(['/mi-perfil']);
  }

  // Método para mostrar una alerta de error
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
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
    // Verificar que el campo de correo no esté vacío
    if (!this.email) {
      this.mostrarAlerta('Debe ingresar un e-mail válido');
      return;
    }

    // Validar el formato del correo
    if (!this.validarEmail(this.email)) {
      this.mostrarAlerta('Formato de e-mail inválido');
      return;
    }

    // Verificar que la contraseña no esté vacía
    if (!this.password) {
      this.mostrarAlerta('Debe ingresar una contraseña');
      return;
    }

    // Verificar que la contraseña tenga entre 4 y 6 caracteres
    if (this.password.length < 4 || this.password.length > 6) {
      this.mostrarAlerta('La contraseña debe tener entre 4 y 6 caracteres.');
      return;
    }

    // Si todas las validaciones son correctas, inicia la simulación de inicio de sesión
    this.loading = true;
    await new Promise(resolve => setTimeout(resolve, 3000));  // Simula una espera de 3 segundos
    this.loading = false;
    this.router.navigate(['/home']);  // Navega a la página de inicio después de iniciar sesión
  }

  // Método para recuperar la contraseña
  recoverPassword() {
    console.log("Recuperar contraseña");
    // Lógica adicional para recuperación de contraseña (si es necesario)
  }

  // Método para ir a la página de registro
  goToRegister() {
    console.log("Ir a Registro");
    // Lógica adicional para redirigir a la página de registro (si es necesario)
  }
}
