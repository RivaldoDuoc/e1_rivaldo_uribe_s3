import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmacionDialogComponent } from '../components/confirmacion-dialog/confirmacion-dialog.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  perfilForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  guardarPerfil(): void {
    if (this.perfilForm.valid) {
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Guardar Perfil de Usuario',
          mensaje: '¿Está seguro que desea guardar?',
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Error',
          mensaje: 'Por favor complete todos los campos correctamente.',
        }
      });
    }
  }
}
