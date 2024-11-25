import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmacionDialogComponent } from '../components/confirmacion-dialog/confirmacion-dialog.component';
import { DbService } from '../services/db.service'; // Importar el servicio de SQLite

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  perfilForm: FormGroup; // Formulario del perfil
  isFirstUser: boolean = false; // Verifica si es el primer usuario
  tipoUsuario: string = 'user'; // Por defecto, los usuarios son de tipo 'user'

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private dbService: DbService // Inyectar el servicio de SQLite
  ) {
    // Inicializar el formulario con validaciones
    this.perfilForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
        ],
        confirmPassword: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  async ngOnInit(): Promise<void> {
    // Verificar si es el primer usuario registrado
    const users = await this.dbService.getAllUsers();
    this.isFirstUser = users.length === 0;

    // Si es el primer usuario, permitir el rol "admin"
    if (this.isFirstUser) {
      this.tipoUsuario = 'admin';
    }
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Guardar perfil de usuario
  async guardarPerfil(): Promise<void> {
    if (this.perfilForm.valid) {
      // Mostrar un diálogo de confirmación
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Guardar Perfil de Usuario',
          mensaje: '¿Está seguro que desea guardar?',
        },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          // Extraer datos del formulario
          const { nombre, apellidos, email, password, fechaNacimiento } =
            this.perfilForm.value;

          try {
            // Guardar usuario en la base de datos
            await this.dbService.addUser(
              nombre,
              apellidos,
              fechaNacimiento,
              email,
              password,
              this.tipoUsuario
            );
            // Redirigir al login después de guardar
            this.router.navigate(['/login']);
          } catch (error) {
            // Mostrar error si el email ya está registrado
            this.dialog.open(ConfirmacionDialogComponent, {
              data: {
                titulo: 'Error',
                mensaje: 'El email ingresado ya está registrado.',
              },
            });
          }
        }
      });
    } else {
      // Mostrar un mensaje si el formulario no es válido
      this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Error',
          mensaje: 'Por favor complete todos los campos correctamente.',
        },
      });
    }
  }
}
