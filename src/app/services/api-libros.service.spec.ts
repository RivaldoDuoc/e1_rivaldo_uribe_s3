import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiLibrosService } from './api-libros.service';

describe('ApiLibrosService', () => {
  let service: ApiLibrosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiLibrosService],
    });

    service = TestBed.inject(ApiLibrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

 
});
