export interface Comentario {
    usuario: string;
    texto: string;
  }
  
  export interface Libro {
    imagen: string;
    titulo: string;
    autor: string;
    isbn: string;
    resena: string;
    comentarios: Comentario[];
    categoria: string;
    usuario: string; // Incluido según las reglas de la API
  }
  