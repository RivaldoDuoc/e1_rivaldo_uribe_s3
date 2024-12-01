import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas HTTP
import { ApiLibrosService } from './api-libros.service';

describe('ApiLibrosService', () => {
  let service: ApiLibrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule
      providers: [ApiLibrosService], // Proveedor del servicio 
    });
    service = TestBed.inject(ApiLibrosService); // Instancia el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio fue creado
  });
});
