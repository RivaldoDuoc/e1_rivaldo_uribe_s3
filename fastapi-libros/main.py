from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Modelo para Comentarios
class Comentario(BaseModel):
    usuario: str
    texto: str

# Modelo para Libros
class Libro(BaseModel):
    imagen: Optional[str] = "assets/img/default-book.jpg"  # Valor por defecto para imagen
    titulo: str
    autor: str
    isbn: str
    resena: Optional[str] = ""
    comentarios: List[Comentario] = []
    categoria: str
    usuario: str


# Base de datos simulada
libros_db: List[Libro] = [
    {
        "imagen": "assets/img/9788425451096.jpg",
        "titulo": "Hombre en Busca de Sentido",
        "autor": "Viktor Frankl",
        "isbn": "9788425451096",
        "resena": "Un libro profundo que explora el sentido de la vida a través de la psicoterapia.",
        "comentarios": [],
        "categoria": "populares",
        "usuario": "admin",
    }
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Endpoints
@app.get("/libros", response_model=List[Libro])
async def get_libros():
    print("Obteniendo todos los libros...")
    return libros_db

@app.get("/libros/{isbn}", response_model=Libro)
async def get_libro(isbn: str):
    print(f"Buscando libro con ISBN: {isbn}")
    for libro in libros_db:
        if libro["isbn"] == isbn:
            return libro
    raise HTTPException(status_code=404, detail="Libro no encontrado")


@app.post("/libros", response_model=Libro)
async def add_libro(libro: Libro):
    print("Libro recibido:", libro)  # Depuración
    for existing_libro in libros_db:
        if existing_libro["isbn"] == libro.isbn:
            raise HTTPException(status_code=400, detail="El libro ya existe con ese ISBN")
    libros_db.append(libro.dict())
    return libro


@app.put("/libros/{isbn}", response_model=Libro)
async def update_libro(isbn: str, updated_libro: Libro):
    for index, libro in enumerate(libros_db):
        if libro["isbn"] == isbn:
            if updated_libro.usuario == libro["usuario"] or updated_libro.usuario == "admin":
                libros_db[index] = updated_libro.dict()
                return updated_libro
            raise HTTPException(status_code=403, detail="No tienes permisos para modificar este libro")
    raise HTTPException(status_code=404, detail="Libro no encontrado")

@app.delete("/libros/{isbn}")
async def delete_libro(isbn: str, usuario: str):
    for index, libro in enumerate(libros_db):
        if libro["isbn"] == isbn:
            if libro["usuario"] == usuario or usuario == "admin":
                del libros_db[index]
                return {"message": "Libro eliminado exitosamente"}
            raise HTTPException(status_code=403, detail="No tienes permisos para eliminar este libro")
    raise HTTPException(status_code=404, detail="Libro no encontrado")
