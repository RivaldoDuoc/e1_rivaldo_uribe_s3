import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros = [
    {
      imagen: 'assets/img/libro1.jpg',
      titulo: 'Hombre en Busca de Sentido',
      autor: 'Viktor Frankl',
      isbn: '9788425451096',
      resena: 'Un libro profundo que explora el sentido de la vida a través de la psicoterapia.',
      comentarios: [
        { usuario: 'Usuario1', texto: 'Muy buen libro!' },
        { usuario: 'Usuario2', texto: 'Interesante y educativo.' },
      ],
    },
    {
      imagen: 'assets/img/libro2.jpg',
      titulo: 'Harry Potter y la Piedra Filosofal',
      autor: 'J.K. Rowling',
      isbn: '9789566075752',
      resena: 'La primera aventura de Harry Potter, llena de magia y misterio.',
      comentarios: [
        { usuario: 'Usuario3', texto: 'Un clásico moderno!' },
        { usuario: 'Usuario4', texto: 'Inspirador y emocionante.' },
      ],
    },
    {
      imagen: 'assets/img/libro3.jpg',
      titulo: 'Alicia en el País de las Maravillas',
      autor: 'Lewis Carroll',
      isbn: '9788415618713',
      resena: 'Una historia surrealista que te lleva a un mundo de fantasía y aventuras.',
      comentarios: [
        { usuario: 'Usuario5', texto: 'Un viaje maravilloso!' },
        { usuario: 'Usuario6', texto: 'Muy entretenido y extraño.' },
      ],
    },
  ];

  constructor() {}

  getLibros() {
    return this.libros;
  }

  getLibroPorISBN(isbn: string) {
    return this.libros.find((libro) => libro.isbn === isbn);
  }
}
