import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmacionDialogComponent } from '../components/confirmacion-dialog/confirmacion-dialog.component';
import { DbService } from '../services/db.service'; // Servicio de SQLite
import { Storage } from '@ionic/storage-angular'; // Manejo de sesión

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {
  perfilForm: FormGroup; // Formulario del perfil
  isFirstUser: boolean = false; // Verifica si es el primer usuario
  tipoUsuario: string = 'user'; // Tipo de usuario (por defecto 'user')

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private dbService: DbService,
    private storage: Storage,
    private route: ActivatedRoute // Para capturar parámetros de la ruta
  ) {
    // Inicializar el formulario con validaciones
    this.perfilForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]], // Solo lectura
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
    await this.storage.create(); // Asegura que el almacenamiento esté listo

    // Verificar si se accede desde el login (registro)
    const isRegistro = this.route.snapshot.queryParamMap.get('registro') === 'true';

    if (isRegistro) {
      // Si es registro, limpiar el formulario
      this.perfilForm.reset();
    } else {
      // Si no es registro, cargar datos del usuario logueado
      const usuarioEmail = await this.storage.get('usuarioEmail');
      if (usuarioEmail) {
        const usuarioActivo = await this.dbService.getUserByEmail(usuarioEmail);
        if (usuarioActivo) {
          this.perfilForm.patchValue({
            nombre: usuarioActivo.nombre,
            apellidos: usuarioActivo.apellidos,
            email: usuarioActivo.email, // Solo lectura
            fechaNacimiento: usuarioActivo.fechaNacimiento,
            password: '', // Contraseña en blanco
            confirmPassword: '', // Validación de contraseña
          });
          this.tipoUsuario = usuarioActivo.tipoUsuario;
        }
      }
    }

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

  // Guardar cambios en el perfil del usuario
  async guardarPerfil(): Promise<void> {
    if (this.perfilForm.valid) {
      // Mostrar un diálogo de confirmación
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Guardar Cambios',
          mensaje: '¿Está seguro que desea guardar los cambios?',
        },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          // Extraer datos del formulario
          const { nombre, apellidos, password, fechaNacimiento } = this.perfilForm.value;
          const usuarioEmail = await this.storage.get('usuarioEmail');

          try {
            // Actualizar los datos del usuario en la base de datos
            const usuarioActivo = await this.dbService.getUserByEmail(usuarioEmail);
            if (usuarioActivo) {
              await this.dbService.updateUser(
                usuarioActivo.id,
                nombre,
                apellidos,
                fechaNacimiento,
                usuarioEmail, // Mantener el email actual
                password,
                usuarioActivo.tipoUsuario
              );
              const alert = await this.dialog.open(ConfirmacionDialogComponent, {
                data: {
                  titulo: 'Éxito',
                  mensaje: 'Los cambios fueron guardados correctamente.',
                },
              });
              await alert.afterClosed().toPromise();
            }
          } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            this.dialog.open(ConfirmacionDialogComponent, {
              data: {
                titulo: 'Error',
                mensaje: 'Hubo un problema al guardar los cambios.',
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
