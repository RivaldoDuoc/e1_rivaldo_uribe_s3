import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros = [
    {
      imagen: 'assets/img/9788425451096.jpg',
      titulo: 'Hombre en Busca de Sentido',
      autor: 'Viktor Frankl',
      isbn: '9788425451096',
      resena: 'Un libro profundo que explora el sentido de la vida a través de la psicoterapia.',
      comentarios: [
        { usuario: 'Usuario1', texto: 'Muy buen libro!' },
        { usuario: 'Usuario2', texto: 'Interesante y educativo.' },
      ],
      categoria: 'mejores'
    },
    {
      imagen: 'assets/img/9789566075752.jpg',
      titulo: 'Harry Potter y la Piedra Filosofal',
      autor: 'J.K. Rowling',
      isbn: '9789566075752',
      resena: 'La primera aventura de Harry Potter, llena de magia y misterio.',
      comentarios: [
        { usuario: 'Usuario3', texto: 'Un clásico moderno!' },
        { usuario: 'Usuario4', texto: 'Inspirador y emocionante.' },
      ],
      categoria: 'populares'
    },
    {
      imagen: 'assets/img/9788415618713.jpg',
      titulo: 'Alicia en el País de las Maravillas',
      autor: 'Lewis Carroll',
      isbn: '9788415618713',
      resena: 'Una historia surrealista que te lleva a un mundo de fantasía y aventuras.',
      comentarios: [
        { usuario: 'Usuario5', texto: 'Un viaje maravilloso!' },
        { usuario: 'Usuario6', texto: 'Muy entretenido y extraño.' },
      ],
      categoria: 'clasicos'
    },
    {
      imagen: 'assets/img/9788418933011.jpg',
      titulo: '1984 (Clásicos ilustrados)',
      autor: 'George Orwell',
      isbn: '9788418933011',
      resena: 'Una novela distópica que muestra un futuro sombrío y opresivo bajo un régimen totalitario.',
      comentarios: [
        { usuario: 'Usuario7', texto: 'Imprescindible para entender la opresión.' },
        { usuario: 'Usuario8', texto: 'Inquietante y visionario.' },
      ],
      categoria: 'clasicos'
    },
    {
      imagen: 'assets/img/9789562583480.jpg',
      titulo: 'Cincuenta sombras de Grey',
      autor: 'E.L. James',
      isbn: '9789562583480',
      resena: 'Una historia de romance y erotismo que explora una relación intensa y compleja.',
      comentarios: [
        { usuario: 'Usuario9', texto: 'Intenso y provocador.' },
        { usuario: 'Usuario10', texto: 'Una lectura que engancha.' },
      ],
      categoria: 'populares'
    },
    {
      imagen: 'assets/img/9789504932840.jpg',
      titulo: 'Inferno',
      autor: 'Dan Brown',
      isbn: '9789504932840',
      resena: 'Un thriller que sigue al profesor Robert Langdon en una carrera para resolver un misterio basado en la Divina Comedia de Dante.',
      comentarios: [
        { usuario: 'Usuario11', texto: 'Intrigante y lleno de suspenso.' },
        { usuario: 'Usuario12', texto: 'Dan Brown no decepciona.' },
      ],
      categoria: 'recomendados'
    },
    {
      imagen: 'assets/img/9788489624429.jpg',
      titulo: 'Las baladas del ajo',
      autor: 'Mo Yan',
      isbn: '9788489624429',
      resena: 'Una novela que retrata la vida rural en China, con una crítica a la corrupción y opresión del sistema.',
      comentarios: [
        { usuario: 'Usuario13', texto: 'Una mirada fascinante a la sociedad china.' },
        { usuario: 'Usuario14', texto: 'Impactante y emotivo.' },
      ],
      categoria: 'mejores'
    }
  ];

  constructor() {}

  getLibros() {
    return this.libros;
  }

  getLibrosMejoresValorados() {
    return this.libros.filter(libro => libro.categoria === 'mejores');
  }

  getLibrosRecientes() {
    return this.libros.filter(libro => libro.categoria === 'recientes');
  }

  getLibrosPopulares() {
    return this.libros.filter(libro => libro.categoria === 'populares');
  }

  getLibrosRecomendados() {
    return this.libros.filter(libro => libro.categoria === 'recomendados');
  }

  getLibrosClasicos() {
    return this.libros.filter(libro => libro.categoria === 'clasicos');
  }

  getLibroPorISBN(isbn: string) {
    return this.libros.find((libro) => libro.isbn === isbn);
  }
}
