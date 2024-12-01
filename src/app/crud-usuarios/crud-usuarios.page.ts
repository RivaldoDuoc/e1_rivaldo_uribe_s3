import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../services/db.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../components/confirmacion-dialog/confirmacion-dialog.component';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.page.html',
  styleUrls: ['./crud-usuarios.page.scss'],
})
export class CrudUsuariosPage implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  editForm: FormGroup = this.fb.group({}); // Garantizar que no sea nulo

  constructor(private dbService: DbService, private fb: FormBuilder, private dialog: MatDialog) {}

  // Se ejecuta al inicializar el componente y carga los usuarios.
  async ngOnInit() {
    await this.loadUsers();
  }

  // Carga todos los usuarios desde la base de datos.
  async loadUsers() {
    this.users = await this.dbService.getAllUsers();
  }

  // Configura el formulario de edición para el usuario seleccionado.
  editUser(user: any) {
    this.selectedUser = user;
    this.editForm = this.fb.group({
      nombre: [user.nombre, Validators.required],
      apellidos: [user.apellidos, Validators.required],
      email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      tipoUsuario: [user.tipoUsuario, Validators.required],
    });
  }

  // Guarda los cambios realizados en el formulario de edición.
  async saveChanges() {
    if (this.editForm.valid) {
      const updatedUser = {
        id: this.selectedUser.id,
        ...this.editForm.getRawValue(),
      };

      try {
        // Verificar si se intenta cambiar el único admin a otro rol
        if (
          this.selectedUser.tipoUsuario === 'admin' &&
          updatedUser.tipoUsuario !== 'admin'
        ) {
          const adminCount = await this.dbService.countAdmins();
          if (adminCount <= 1) {
            alert('Debe existir al menos un usuario con rol de administrador.');
            return;
          }
        }

        // Actualizar el usuario en la base de datos
        await this.dbService.updateUser(
          updatedUser.id,
          updatedUser.nombre,
          updatedUser.apellidos,
          this.selectedUser.fechaNacimiento,
          updatedUser.email,
          updatedUser.password || this.selectedUser.password,
          updatedUser.tipoUsuario
        );
        alert('Usuario actualizado exitosamente.');
        this.selectedUser = null;
        this.editForm = this.fb.group({});
        await this.loadUsers();
      } catch (error) {
        const err = error as Error;
        alert('Error al actualizar el usuario: ' + err.message);
      }
    } else {
      alert('Por favor complete los campos correctamente.');
    }
  }

  // Cancela la edición y resetea el formulario.
  cancelEdit() {
    this.selectedUser = null;
    this.editForm = this.fb.group({});
  }

  // Elimina un usuario, mostrando un diálogo de confirmación.
  async deleteUser(userId: number) {
    const userToDelete = this.users.find(user => user.id === userId);

    // Verificar si se está intentando eliminar el último administrador
    if (userToDelete.tipoUsuario === 'admin') {
      const adminCount = await this.dbService.countAdmins();
      if (adminCount <= 1) {
        alert('Debe existir al menos un usuario con rol de administrador.');
        return;
      }
    }

    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      data: {
        titulo: 'Eliminar Usuario',
        mensaje: '¿Está seguro que desea eliminar este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.dbService.deleteUser(userId);
        await this.loadUsers();
      }
    });
  }
}
