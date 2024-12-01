import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { DetallePage } from './detalle.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LibrosService } from '../services/libros.service';
import { MisLecturasService } from '../services/mis-lecturas.service';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;
  let mockActivatedRoute: any;
  let mockLibrosService: any;
  let mockMisLecturasService: any;
  let mockAlertController: any;

  beforeEach(waitForAsync(() => {
    // Mock para ActivatedRoute
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy('get').and.returnValue('123456789'), // Simula un ISBN
        },
      },
    };

    // Mock para LibrosService
    mockLibrosService = jasmine.createSpyObj('LibrosService', ['getLibroPorISBN']);
    mockLibrosService.getLibroPorISBN.and.returnValue({
      titulo: 'Libro de Prueba',
      autor: 'Autor de Prueba',
      isbn: '123456789',
      resena: 'Una reseña de prueba',
      comentarios: [],
    });

    // Mock para MisLecturasService
    mockMisLecturasService = jasmine.createSpyObj('MisLecturasService', ['getLecturaPorISBN']);
    mockMisLecturasService.getLecturaPorISBN.and.returnValue(null); // Simula que no se encuentra en "MisLecturas"

    // Mock para AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      })
    );

    TestBed.configureTestingModule({
      declarations: [DetallePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LibrosService, useValue: mockLibrosService },
        { provide: MisLecturasService, useValue: mockMisLecturasService },
        { provide: AlertController, useValue: mockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load book details on init', () => {
    component.ngOnInit();
    expect(mockActivatedRoute.snapshot.queryParamMap.get).toHaveBeenCalledWith('isbn');
    expect(mockMisLecturasService.getLecturaPorISBN).toHaveBeenCalledWith('123456789');
    expect(mockLibrosService.getLibroPorISBN).toHaveBeenCalledWith('123456789');
    expect(component.libro.titulo).toBe('Libro de Prueba');
  });

  it('should add a comment and reset form on enviarValoracion', async () => {
    component.comentarioUsuario = 'Excelente libro';
    await component.enviarValoracion();

    expect(component.libro.comentarios.length).toBe(1);
    expect(component.libro.comentarios[0].texto).toBe('Excelente libro');
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Gracias',
      message: 'Gracias por evaluar este libro.',
    }));
    expect(component.comentarioUsuario).toBe('');
    expect(component.valoracion).toBe(3);
  });
});
