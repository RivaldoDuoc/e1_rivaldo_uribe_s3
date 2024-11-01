import { Component, OnInit } from '@angular/core';
import { MisLecturasService } from '../services/mis-lecturas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-lecturas',
  templateUrl: './mis-lecturas.page.html',
  styleUrls: ['./mis-lecturas.page.scss'],
})
export class MisLecturasPage implements OnInit {
  misLecturas: any[] = []; // Asegúrate de inicializar esto como un array

  constructor(
    private misLecturasService: MisLecturasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerLecturas();
  }

  // Método para obtener las lecturas desde el servicio
  obtenerLecturas() {
    this.misLecturas = this.misLecturasService.getLecturas();
  }

  // Navega a la página de detalle al seleccionar un libro
  verDetalle(libro: any) {
    this.router.navigate(['/detalle'], { queryParams: { isbn: libro.isbn } });
  }

  // Elimina una lectura usando el servicio y actualiza la lista
  eliminarLectura(index: number) {
    this.misLecturasService.eliminarLectura(index);
    this.obtenerLecturas(); // Actualiza la lista después de eliminar
  }
}

