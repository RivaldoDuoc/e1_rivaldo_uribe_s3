import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibrosService } from '../services/libros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  categoriaSeleccionada = 'mejores'; // Categoría seleccionada por defecto
  librosFiltrados: any[] = []; // Lista de libros filtrados según la categoría
  todosLosLibros: any[] = []; // Lista completa de libros para búsquedas en todas las categorías

  constructor(private router: Router, private librosService: LibrosService) {}

  ngOnInit() {
    this.todosLosLibros = this.librosService.getLibros(); // Carga la lista completa de libros
    this.cambiarCategoria(); // Cargar libros de la categoría por defecto al iniciar
  }

  // Método para actualizar la lista de libros según la categoría seleccionada
  cambiarCategoria() {
    // Filtra los libros de acuerdo con la categoría seleccionada
    this.librosFiltrados = this.todosLosLibros.filter(libro => 
      libro.categoria === this.categoriaSeleccionada
    );
  }

  // Método para buscar libros en todas las categorías según el término ingresado
  buscarLibro(event: any) {
    const query = event.target.value.toLowerCase(); // Obtiene el término de búsqueda en minúsculas

    if (query) {
      // Filtra todos los libros según el término de búsqueda en título, autor o ISBN
      this.librosFiltrados = this.todosLosLibros.filter(libro =>
        libro.titulo.toLowerCase().includes(query) || 
        libro.autor.toLowerCase().includes(query) ||
        libro.isbn.includes(query)
      );
    } else {
      // Si no hay término de búsqueda, muestra los libros de la categoría seleccionada
      this.cambiarCategoria();
    }

    console.log(`Buscando libros con: ${query}`);
  }

  verDetalle(libro: any) {
    // Navega a la página de detalle enviando el ISBN
    this.router.navigate(['/detalle'], { queryParams: { isbn: libro.isbn } });
  }
}
