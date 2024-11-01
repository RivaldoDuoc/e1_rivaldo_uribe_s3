import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibrosService } from '../services/libros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  mejoresValorados: any[] = [];

  constructor(private router: Router, private librosService: LibrosService) {}

  ngOnInit() {
    // Obtiene la lista de libros mejor valorados desde el servicio
    this.mejoresValorados = this.librosService.getLibros();
  }

  buscarLibro(event: any) {
    const query = event.target.value.toLowerCase();
    console.log(`Buscando libros con: ${query}`);
    // Aquí puedes implementar lógica adicional para filtrar los libros
  }

  verDetalle(libro: any) {
    // Navega a la página de detalle enviando el ISBN
    this.router.navigate(['/detalle'], { queryParams: { isbn: libro.isbn } });
  }
}
