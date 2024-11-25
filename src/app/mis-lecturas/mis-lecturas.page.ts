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
  usuarioId: number = 1; // ID del usuario actual (obtener mediante autenticación)

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
    console.log('Email recuperado del localStorage:', usuarioEmail);

    if (usuarioEmail) {
      const usuarioLogueado = await this.dbService.getUserByEmail(usuarioEmail);
      console.log('Usuario logueado:', usuarioLogueado);

      if (usuarioLogueado) {
        this.usuarioId = usuarioLogueado.id; // Asigna el ID del usuario logueado
        await this.cargarLecturas();
      } else {
        this.mostrarMensajeError('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
      }
    } else {
      this.mostrarMensajeError('No se encontró el email del usuario en el almacenamiento local. Por favor, inicia sesión.');
    }
  }

  /**
   * Mostrar mensaje de error en un alert.
   * @param mensaje Mensaje a mostrar.
   */
  async mostrarMensajeError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  /**
   * Cargar libros desde la base de datos local.
   */
  async cargarLecturas() {
    try {
      this.misLecturas = await this.dbService.obtenerLibros(this.usuarioId);
      console.log('Lecturas cargadas desde la base de datos:', this.misLecturas);
    } catch (error) {
      console.error('Error al cargar lecturas desde la base de datos:', error);
    }
  }

  /**
   * Buscar libro en la API y agregarlo a la lista.
   */
  async buscarLibro() {
    const datoBusqueda = this.buscarForm.get('datoBusqueda')?.value;
  
    if (!datoBusqueda) {
      this.mensajeError = 'Debes ingresar un ISBN o título válido.';
      return;
    }
  
    this.apiLibrosService.buscarLibro(datoBusqueda).subscribe(
      async (response) => {
        if (response) {
          const nuevoLibro = {
            titulo: response.titulo,
            autor: response.autor,
            isbn: response.isbn,
            imagen: response.imagen,
            resena: response.reseña,
            valoracion: 0,
            comentarios: '',
          };
  
          // Guardar libro en la base de datos y lista local
          await this.agregarLibro(nuevoLibro);
          this.misLecturas.push(nuevoLibro);
          this.buscarForm.reset();
          this.mensajeError = ''; // Limpiar mensaje de error
        } else {
          this.mensajeError = 'No se encontraron resultados.';
        }
      },
      (error) => {
        console.error('Error al buscar libro en la API:', error);
        this.mensajeError = 'Hubo un problema al buscar el libro. Intenta nuevamente.';
      }
    );
  }
  
  

  /**
   * Agregar un libro a la base de datos local.
   */
  async agregarLibro(libro: any) {
    try {
      await this.dbService.agregarLibro(libro, this.usuarioId);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Libro agregado correctamente a tu biblioteca.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      console.error('Error al agregar libro:', error);
    }
  }

  /**
   * Confirmar eliminación de un libro.
   */
  async confirmarEliminar(isbn: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este libro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => this.eliminarLibro(isbn),
        },
      ],
    });
    await alert.present();
  }

  /**
   * Eliminar un libro de la base de datos local y de la lista.
   */
  async eliminarLibro(isbn: string) {
    try {
      await this.dbService.eliminarLibro(isbn);
      this.misLecturas = this.misLecturas.filter((libro) => libro.isbn !== isbn);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Libro eliminado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      console.error('Error al eliminar libro:', error);
    }
  }

  /**
   * Editar un libro mediante un modal.
   */
  async editarLibro(libro: any) {
    const modal = await this.modalController.create({
      component: EditarLibroPage,
      componentProps: { libro },
    });

    modal.onDidDismiss().then(async (result: { data?: any; role?: string }) => {
      if (result.data?.eliminado) {
        this.misLecturas = this.misLecturas.filter((l) => l.isbn !== libro.isbn);
      } else if (result.data) {
        const index = this.misLecturas.findIndex((l) => l.isbn === libro.isbn);
        if (index > -1) {
          this.misLecturas[index] = result.data;
        }
      }
    });

    await modal.present();
  }
} 
