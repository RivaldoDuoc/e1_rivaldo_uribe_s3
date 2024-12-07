import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from '../services/db.service';
import { EditarLibroPage } from '../editar-libro/editar-libro.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChildren('libroImagen') libroImagenes!: QueryList<ElementRef>; // Referencia a las imágenes
  categoriaSeleccionada = 'mejores'; // Categoría seleccionada por defecto
  librosFiltrados: any[] = []; // Lista completa de libros filtrados
  librosMostrados: any[] = []; // Lista de libros actualmente visibles
  cantidadPorCargar = 5; // Cantidad de libros por bloque
  infiniteScrollDisabled = false; // Control del infinite scroll

  constructor(private dbService: DbService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.cambiarCategoria(); // Inicializar datos
    this.configurarIntersectionObserver(); // Configurar observer para las imágenes
  }

  async cambiarCategoria() {
    try {
      if (this.categoriaSeleccionada === 'mejores') {
        this.librosFiltrados = await this.dbService.obtenerMejoresValorados();
      } else {
        this.librosFiltrados = await this.dbService.obtenerLibrosPorCategoria(this.categoriaSeleccionada);
      }

      this.librosMostrados = this.librosFiltrados.slice(0, this.cantidadPorCargar);
      this.infiniteScrollDisabled = this.librosMostrados.length >= this.librosFiltrados.length;
    } catch (error) {
      console.error('Error al cambiar de categoría:', error);
    }
  }

  cargarMasLibros(event: any) {
    const siguienteBloque = this.librosFiltrados.slice(
      this.librosMostrados.length,
      this.librosMostrados.length + this.cantidadPorCargar
    );

    this.librosMostrados = [...this.librosMostrados, ...siguienteBloque];
    event.target.complete();

    if (this.librosMostrados.length >= this.librosFiltrados.length) {
      this.infiniteScrollDisabled = true;
    }
  }

  buscarLibro(event: any) {
    try {
      const query = event.target.value.toLowerCase();
  
      if (query) {
        // Realizar búsqueda en la base de datos
        this.dbService.buscarLibros(query).then((resultados) => {
          this.librosFiltrados = resultados; // Asignar resultados globales
          this.librosMostrados = this.librosFiltrados.slice(0, this.cantidadPorCargar);
          this.infiniteScrollDisabled = this.librosMostrados.length >= this.librosFiltrados.length;
        });
      } else {
        this.cambiarCategoria(); // Si el campo está vacío, regresar a la categoría seleccionada
      }
    } catch (error) {
      console.error('Error al buscar libros:', error);
    }
  }
  
  

  async editarLibro(libro: any) {
    try {
      const modal = await this.modalController.create({
        component: EditarLibroPage,
        componentProps: { libro },
      });

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          await this.cambiarCategoria();
        }
      });

      await modal.present();
    } catch (error) {
      console.error('Error al abrir el modal de edición:', error);
    }
  }

  configurarIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const img = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            img.classList.add('zoom-in'); // Activar animación
          } else {
            img.classList.remove('zoom-in'); // Eliminar clase para que se pueda volver a aplicar
          }
        });
      },
      { threshold: 0.1 } // Se activa cuando el 10% de la imagen está visible
    );
  
    this.libroImagenes.changes.subscribe((imagenes) => {
      imagenes.forEach((img: ElementRef) => observer.observe(img.nativeElement));
    });
  }
  
}
