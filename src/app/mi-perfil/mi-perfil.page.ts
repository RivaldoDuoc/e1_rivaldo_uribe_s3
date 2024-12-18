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
  isRegistro: boolean = false; // Modo registro o edición

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
        email: ['', [Validators.required, Validators.email]], // Habilitado en modo registro
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
    await this.dbService.initializeDatabase(); // Asegura que la base de datos esté inicializada

    // Verificar si se accede desde el login (registro)
    this.isRegistro = this.route.snapshot.queryParamMap.get('registro') === 'true';

    if (this.isRegistro) {
      // Si es registro, limpiar el formulario y habilitar el campo email
      this.perfilForm.reset();
      this.perfilForm.get('email')?.enable();
      console.log('Modo registro: campo email habilitado.');
    } else {
      // Si no es registro, cargar datos del usuario logueado
      const usuarioEmail = await this.storage.get('usuarioEmail');
      if (usuarioEmail) {
        const usuarioActivo = await this.dbService.getUserByEmail(usuarioEmail);
        if (usuarioActivo) {
          this.perfilForm.patchValue({
            nombre: usuarioActivo.nombre,
            apellidos: usuarioActivo.apellidos,
            email: usuarioActivo.email,
            fechaNacimiento: usuarioActivo.fechaNacimiento,
            password: '',
            confirmPassword: '',
          });
          this.tipoUsuario = usuarioActivo.tipoUsuario;
          this.perfilForm.get('email')?.disable(); // Deshabilitar el email para edición
          console.log('Modo edición: campo email deshabilitado.');
        }
      }
    }

    try {
      // Verificar si es el primer usuario registrado
      const users = await this.dbService.getAllUsers();
      this.isFirstUser = users.length === 0;

      // Si es el primer usuario, permitir el rol "admin"
      if (this.isFirstUser) {
        this.tipoUsuario = 'admin';
      }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      this.isFirstUser = false; // Considerar como no el primer usuario en caso de error
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
    console.log('Iniciando guardarPerfil...');
    console.log('Estado del formulario:', this.perfilForm.valid);
    console.log('Valores del formulario:', this.perfilForm.value);

    if (this.perfilForm.valid) {
      try {
        const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
          data: {
            titulo: 'Guardar Cambios',
            mensaje: '¿Está seguro que desea guardar los cambios?',
          },
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const { nombre, apellidos, email, password, fechaNacimiento } = this.perfilForm.value;
            console.log('Datos del formulario a guardar:', { nombre, apellidos, email, password, fechaNacimiento });

            // Verificar si ya existe un usuario en la sesión
            const usuarioEmail = await this.storage.get('usuarioEmail');
            console.log('Usuario logueado actualmente:', usuarioEmail);

            if (this.isRegistro) {
              // Registrar un nuevo usuario
              try {
                const tipoUsuario = this.isFirstUser ? 'admin' : 'user';
                await this.dbService.addUser(
                  nombre,
                  apellidos,
                  fechaNacimiento,
                  email,
                  password,
                  tipoUsuario
                );
                console.log('Nuevo usuario registrado correctamente en SQLite.');

                // Guardar el email en localStorage
                await this.storage.set('usuarioEmail', email);

                // Mostrar mensaje de éxito
                this.dialog.open(ConfirmacionDialogComponent, {
                  data: {
                    titulo: 'Éxito',
                    mensaje: 'Usuario registrado correctamente.',
                  },
                });
              } catch (error) {
                console.error('Error al registrar el usuario:', error);
                this.dialog.open(ConfirmacionDialogComponent, {
                  data: {
                    titulo: 'Error',
                    mensaje: 'No se pudo registrar el usuario. Verifique los datos ingresados.',
                  },
                });
              }
            } else {
              // Actualizar un usuario existente
              try {
                const usuarioActivo = await this.dbService.getUserByEmail(usuarioEmail);
                console.log('Usuario activo encontrado en SQLite:', usuarioActivo);

                if (usuarioActivo) {
                  await this.dbService.updateUser(
                    usuarioActivo.id,
                    nombre,
                    apellidos,
                    fechaNacimiento,
                    usuarioEmail,
                    password,
                    usuarioActivo.tipoUsuario
                  );
                  console.log('Usuario actualizado correctamente en SQLite.');

                  this.dialog.open(ConfirmacionDialogComponent, {
                    data: {
                      titulo: 'Éxito',
                      mensaje: 'Los cambios fueron guardados correctamente.',
                    },
                  });
                }
              } catch (error) {
                console.error('Error al actualizar el usuario:', error);
                this.dialog.open(ConfirmacionDialogComponent, {
                  data: {
                    titulo: 'Error',
                    mensaje: 'No se pudo actualizar el usuario. Intente nuevamente.',
                  },
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('Error general al guardar los datos:', error);
        this.dialog.open(ConfirmacionDialogComponent, {
          data: {
            titulo: 'Error',
            mensaje: 'Hubo un problema al guardar los datos. Intente nuevamente.',
          },
        });
      }
    } else {
      console.log('Formulario inválido:', this.perfilForm.errors);
      this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          titulo: 'Error',
          mensaje: 'Por favor complete todos los campos correctamente.',
        },
      });
    }
  }
}
