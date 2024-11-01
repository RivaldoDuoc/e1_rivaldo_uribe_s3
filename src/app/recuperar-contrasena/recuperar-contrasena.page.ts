import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {
  recuperarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async recuperarContrasena() {
    if (this.recuperarForm.valid) {
      const alert = await this.alertController.create({
        header: 'Recuperación de Contraseña',
        message: 'Se ha enviado un enlace para recuperar su contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingrese un correo válido.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
