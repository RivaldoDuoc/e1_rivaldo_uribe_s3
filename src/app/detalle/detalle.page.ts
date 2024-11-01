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
  libro: any = {}; // Inicializa como un objeto vacío
  valoracion: number = 3;
  comentarioUsuario: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private librosService: LibrosService,
    private misLecturasService: MisLecturasService
  ) {}

  ngOnInit() {
    // Obtiene el ISBN del libro desde los parámetros de la URL
    const isbn = this.route.snapshot.queryParamMap.get('isbn');
    
    if (isbn) {
      // Primero intenta buscar el libro en MisLecturasService
      this.libro = this.misLecturasService.getLecturaPorISBN(isbn);
      
      // Si no se encuentra en MisLecturas, busca en LibrosService
      if (!this.libro) {
        this.libro = this.librosService.getLibroPorISBN(isbn);
      }

      // Prueba de consola para verificar si se encontró el libro
      console.log('Libro encontrado:', this.libro);
    }
  }

  // Método para enviar la valoración y mostrar el mensaje de agradecimiento
  async enviarValoracion() {
    // Agrega el comentario al libro
    if (this.libro && this.libro.comentarios) {
      this.libro.comentarios.push({
        usuario: 'UsuarioActual', // Puedes reemplazarlo con el nombre del usuario actual
        texto: this.comentarioUsuario,
      });
    }

    // Muestra una alerta de agradecimiento
    const alert = await this.alertController.create({
      header: 'Gracias',
      message: 'Gracias por evaluar este libro.',
      buttons: ['OK'],
    });

    await alert.present();

    // Limpia el comentario y restablece la valoración
    this.comentarioUsuario = '';
    this.valoracion = 3;
  }
}
