import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LibrosService } from '../services/libros.service';
import { MisLecturasService } from '../services/mis-lecturas.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  libro: any = {}; // Inicializo la variable 'libro' como un objeto vacío
  valoracion: number = 3; // Valoración predeterminada del usuario
  comentarioUsuario: string = ''; // Comentario ingresado por el usuario

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private librosService: LibrosService,
    private misLecturasService: MisLecturasService
  ) {}

  ngOnInit() {
    // Obtengo el ISBN del libro desde los parámetros de la URL
    const isbn = this.route.snapshot.queryParamMap.get('isbn');
    
    if (isbn) {
      // Intento primero buscar el libro en 'MisLecturasService'
      this.libro = this.misLecturasService.getLecturaPorISBN(isbn);
      
      // Si no se encuentra en 'MisLecturas', lo busco en 'LibrosService'
      if (!this.libro) {
        this.libro = this.librosService.getLibroPorISBN(isbn);
      }

      // Mensaje de consola para verificar si se encontró el libro
      console.log('Libro encontrado:', this.libro);
    }
  }

  // Método para enviar la valoración y mostrar un mensaje de agradecimiento
  async enviarValoracion() {
    // Si el libro y sus comentarios existen, agrego el comentario del usuario
    if (this.libro && this.libro.comentarios) {
      this.libro.comentarios.push({
        usuario: 'UsuarioActual', // Aquí puedo reemplazar con el nombre del usuario actual
        texto: this.comentarioUsuario,
      });
    }

    // Muestro una alerta de agradecimiento al usuario
    const alert = await this.alertController.create({
      header: 'Gracias',
      message: 'Gracias por evaluar este libro.',
      buttons: ['OK'],
    });

    await alert.present();

    // Limpio el campo de comentario y restablezco la valoración
    this.comentarioUsuario = '';
    this.valoracion = 3;
  }
}
