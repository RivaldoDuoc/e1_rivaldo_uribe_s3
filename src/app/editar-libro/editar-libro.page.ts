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
  libroForm: FormGroup;

  edicionHabilitada: { [key: string]: boolean } = {
    titulo: false,
    autor: false,
    resena: false,
    comentarios: false,
  };

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController,
    private dbService: DbService
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      resena: [''],
      valoracion: [0, [Validators.min(0), Validators.max(5)]],
      imagen: [''],
      comentarios: [''],
    });
  }

  ngOnInit() {
    // Rellena el formulario con los datos del libro recibido
    this.libroForm.patchValue(this.libro);
  }

  habilitarEdicion(campo: string) {
    this.edicionHabilitada[campo] = true; // Habilita edición para el campo seleccionado
  }

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

  guardarCambios() {
    const libroEditado = this.libroForm.value; // Obtén los valores del formulario
    this.modalController.dismiss(libroEditado); // Devuelve el libro editado al cerrar el modal
  }

  cancelar() {
    this.modalController.dismiss(); // Cierra el modal sin cambios
  }

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

  async tomarFotografia() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear, // Asegura que se use la cámara trasera
        correctOrientation: true, // Ajusta automáticamente la orientación de la fotografía
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
