import { Component, OnInit } from '@angular/core';
import { ApiLibrosService } from '../services/api-libros.service';
import { DbService } from '../services/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { EditarLibroPage } from '../editar-libro/editar-libro.page';

@Component({
  selector: 'app-mis-lecturas',
  templateUrl: './mis-lecturas.page.html',
  styleUrls: ['./mis-lecturas.page.scss'],
})
export class MisLecturasPage implements OnInit {
  misLecturas: any[] = []; // Lista de libros cargados
  buscarForm: FormGroup;
  mensajeError: string = '';
  resultadoBusqueda: any = null; // Resultado de la búsqueda
  usuarioId: number = 0; // ID del usuario actual

  constructor(
    private apiLibrosService: ApiLibrosService,
    private dbService: DbService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.buscarForm = this.fb.group({
      datoBusqueda: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const usuarioEmail = localStorage.getItem('usuarioEmail');
    if (usuarioEmail) {
      const usuarioLogueado = await this.dbService.getUserByEmail(usuarioEmail);
      if (usuarioLogueado) {
        this.usuarioId = usuarioLogueado.id;
        await this.cargarLecturas();
      } else {
        this.mostrarMensajeError('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
      }
    } else {
      this.mostrarMensajeError('No se encontró el email del usuario. Por favor, inicia sesión.');
    }
  }

  async cargarLecturas() {
    try {
      this.misLecturas = await this.dbService.obtenerLibros(this.usuarioId);
      if (!this.misLecturas.length) {
        console.log('No hay libros agregados.');
      }
    } catch (error) {
      console.error('Error al cargar lecturas:', error);
    }
  }

  async buscarLibro() {
    const datoBusqueda = this.buscarForm.get('datoBusqueda')?.value;
    if (!datoBusqueda) {
      this.mensajeError = 'Debes ingresar un título o ISBN válido.';
      return;
    }

    try {
      const response = await this.apiLibrosService.buscarLibro(datoBusqueda).toPromise();
      if (response) {
        this.resultadoBusqueda = response;
      } else {
        this.mensajeError = 'No se encontraron resultados.';
      }
    } catch (error) {
      console.error('Error al buscar libro en la API:', error);
      this.mensajeError = 'Hubo un problema al buscar el libro.';
    }
  }

  async guardarLibroDesdeAPI(libro: any) {
    try {
      const nuevoLibro = { ...libro, usuarioId: this.usuarioId };
      await this.dbService.agregarLibro(nuevoLibro, this.usuarioId);
      this.misLecturas = [...this.misLecturas, nuevoLibro];
      this.resultadoBusqueda = null; // Limpia el resultado de búsqueda
    } catch (error) {
      console.error('Error al guardar libro:', error);
    }
  }

  async editarLibro(libro: any) {
    const modal = await this.modalController.create({
      component: EditarLibroPage,
      componentProps: { libro },
    });

    modal.onDidDismiss().then(async (result: { data?: any; role?: string }) => {
      if (result.data) {
        const index = this.misLecturas.findIndex((l) => l.isbn === libro.isbn);
        if (index > -1) {
          this.misLecturas[index] = result.data;
          await this.dbService.actualizarLibro(result.data);
        }
      }
    });

    await modal.present();
  }

  async confirmarEliminar(isbn: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Deseas eliminar este libro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.eliminarLibro(isbn);
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarLibro(isbn: string) {
    try {
      await this.dbService.eliminarLibro(isbn);
      this.misLecturas = this.misLecturas.filter((libro) => libro.isbn !== isbn);
    } catch (error) {
      console.error('Error al eliminar libro:', error);
    }
  }

  async mostrarMensajeError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
