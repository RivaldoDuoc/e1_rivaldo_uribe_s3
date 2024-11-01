import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  perfilForm: FormGroup = this.fb.group({}); // Inicializa perfilForm como un FormGroup vacío

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');
    
    return passwordControl && confirmPasswordControl && passwordControl.value === confirmPasswordControl.value 
      ? null 
      : { passwordMismatch: true };
  }

  async guardarPerfil() {
    if (this.perfilForm.valid) {
      const alert = await this.alertController.create({
        header: 'Perfil Guardado',
        message: 'Sus datos han sido guardados correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      await alert.onDidDismiss();  // Espera a que el usuario cierre el alert antes de navegar
      this.router.navigate(['/login']);  // Navega a la página de login
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor complete todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
