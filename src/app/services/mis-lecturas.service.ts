import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MisLecturasService {
  private lecturas = [
    {
      imagen: 'assets/img/libro4.jpg',
      titulo: 'Cómo programar en Java',
      autor: 'Paul Deitel',
      isbn: '9786073238021',
      resena: 'Un completo manual para aprender a programar en Java, cubriendo desde lo básico hasta conceptos avanzados.',
      comentarios: [
        { usuario: 'Usuario7', texto: 'Muy útil para principiantes y avanzados!' },
        { usuario: 'Usuario8', texto: 'Excelente libro de referencia para Java.' },
      ],
    },
    {
      imagen: 'assets/img/libro5.jpg',
      titulo: 'La casa de los espíritus',
      autor: 'Isabel Allende',
      isbn: '9789871138906',
      resena: 'Una novela mágica y profundamente emotiva que recorre la historia de una familia a lo largo de varias generaciones.',
      comentarios: [
        { usuario: 'Usuario9', texto: 'Una historia apasionante y bien escrita.' },
        { usuario: 'Usuario10', texto: 'Llena de realismo mágico, una lectura inolvidable.' },
      ],
    },
    {
      imagen: 'assets/img/libro6.jpg',
      titulo: 'El diario de Anna Frank (novela ilustrada)',
      autor: 'Anna Frank',
      isbn: '9788466340564',
      resena: 'El conmovedor diario de una joven judía durante la Segunda Guerra Mundial, presentado en un formato ilustrado.',
      comentarios: [
        { usuario: 'Usuario11', texto: 'Una historia poderosa y desgarradora.' },
        { usuario: 'Usuario12', texto: 'Inspirador y conmovedor, una lectura esencial.' },
      ],
    },
  ];

  constructor() {}

  // Método para obtener las lecturas
  getLecturas() {
    return this.lecturas;
  }

  // Método para obtener una lectura por ISBN
  getLecturaPorISBN(isbn: string) {
    return this.lecturas.find((lectura) => lectura.isbn === isbn);
  }

  // Método para eliminar una lectura
  eliminarLectura(index: number) {
    if (index > -1 && index < this.lecturas.length) {
      this.lecturas.splice(index, 1);
    }
  }
}

