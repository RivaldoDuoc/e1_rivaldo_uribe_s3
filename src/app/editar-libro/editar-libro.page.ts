import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { DbService } from '../services/db.service'; // Importa el servicio DbService

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.page.html',
  styleUrls: ['./editar-libro.page.scss'],
})
export class EditarLibroPage {
  @Input() libro: any; // Recibe el libro a editar
  libroForm: FormGroup; // Formulario reactivo para editar libro

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController,
    private dbService: DbService
  ) {
    // Inicializa el formulario del libro con validadores
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      resena: [''],
      valoracion: [0, [Validators.min(0), Validators.max(5)]],
      imagen: [''],
      comentarios: [''],
      categoria: ['Otras categorías', Validators.required], // Campo para categoría
    });
    
  }

  // Carga los datos del libro recibido en el formulario
  ngOnInit() {
    this.libroForm.patchValue(this.libro);
  }

  // Abre un cuadro de confirmación antes de guardar los cambios
  async confirmarGuardar() {
    const alert = await this.alertController.create({
      header: 'Confirmar Guardar',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: () => this.guardarCambios(),
        },
      ],
    });
    await alert.present();
  }

  // Guarda los cambios en la base de datos y cierra el modal
  async guardarCambios() {
    const libroActualizado = this.libroForm.value; // Obtiene los valores del formulario
    try {
      await this.dbService.actualizarLibro(libroActualizado); // Actualiza el libro con el servicio
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Libro actualizado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
  
      this.modalController.dismiss(libroActualizado); // Cierra el modal con los cambios
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron guardar los cambios. Intente nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  

  // Cierra el modal sin realizar ningún cambio
  cancelar() {
    this.modalController.dismiss();
  }

  // Abre un cuadro de confirmación antes de eliminar el libro
  async confirmarEliminar() {
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
          handler: async () => {
            await this.eliminarLibro();
          },
        },
      ],
    });
    await alert.present();
  }

  // Elimina el libro de la base de datos y cierra el modal
  async eliminarLibro() {
    try {
      const isbn = this.libroForm.get('isbn')?.value;
      if (isbn) {
        await this.dbService.eliminarLibro(isbn);
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Libro eliminado correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
        this.modalController.dismiss({ eliminado: true });
      } else {
        throw new Error('ISBN no encontrado.');
      }
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo eliminar el libro.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  // Sube una imagen desde el dispositivo del usuario y la muestra en el formulario
  subirImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.libroForm.patchValue({ imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Toma una foto con la cámara y la agrega al formulario
  async tomarFotografia() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear,
        correctOrientation: true,
      });

      if (photo && photo.base64String) {
        const imageBase64 = `data:image/jpeg;base64,${photo.base64String}`;
        this.libroForm.patchValue({ imagen: imageBase64 });
      }
    } catch (error) {
      console.error('Error al tomar fotografía:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo tomar la fotografía.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
