import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ApiLibrosService {
  private apiUrl = 'https://openlibrary.org/search.json'; // API de Open Library

  constructor(private http: HttpClient) {}

  /**
   * Método para buscar libros por ISBN o título
   * @param {string} query - ISBN o título del libro
   * @returns {Observable<any>} - Información del libro formateada
   */
  buscarLibro(query: string): Observable<any> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    console.log('URL generada para la búsqueda:', url);
  
    return this.http.get(url).pipe(
      map((response: any) => {
        console.log('Respuesta completa de la API:', response); // Debug para verificar la estructura
  
        if (response.docs && response.docs.length > 0) {
          const libro = response.docs[0]; // Primer libro encontrado
          return {
            titulo: libro.title || 'Sin título',
            autor: libro.author_name?.join(', ') || 'Autor desconocido',
            isbn: libro.isbn?.[0] || 'Sin ISBN',
            imagen: libro.cover_i
              ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-L.jpg`
              : 'assets/img/default-book.jpg',
            numeroDePaginas: libro.number_of_pages_median || 'No disponible',
            fechaPublicacion: libro.first_publish_year || 'Fecha desconocida',
            editorial: libro.publisher?.join(', ') || 'Editorial desconocida',
            reseña: libro.subtitle || 'Sin reseña disponible',
          };
        } else {
          console.warn('No se encontraron libros en la respuesta.');
          return null; // Retornar null si no hay resultados
        }
      })
    );
  }
  
  
}
