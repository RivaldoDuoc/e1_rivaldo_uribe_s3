import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MisLecturasPage } from './mis-lecturas.page';
import { ApiLibrosService } from '../services/api-libros.service';
import { DbService } from '../services/db.service';
import { of } from 'rxjs';

describe('MisLecturasPage', () => {
  let component: MisLecturasPage;
  let fixture: ComponentFixture<MisLecturasPage>;
  let mockApiLibrosService: any;
  let mockDbService: any;
  let mockAlertController: any;
  let mockModalController: any;

  beforeEach(waitForAsync(() => {
    // Mock para ApiLibrosService
    mockApiLibrosService = jasmine.createSpyObj('ApiLibrosService', ['buscarLibro']);
    mockApiLibrosService.buscarLibro.and.returnValue(
      of({
        titulo: 'Libro Prueba',
        autor: 'Autor Prueba',
        isbn: '123456789',
        imagen: 'url-imagen',
        reseña: 'Reseña de prueba',
      })
    );

    // Mock para DbService
    mockDbService = jasmine.createSpyObj('DbService', ['obtenerLibros', 'agregarLibro', 'eliminarLibro', 'getUserByEmail']);
    mockDbService.getUserByEmail.and.returnValue(
      Promise.resolve({ id: 1, nombre: 'Test', apellidos: 'User', email: 'test@user.com' })
    );
    mockDbService.obtenerLibros.and.returnValue(
      Promise.resolve([
        {
          titulo: 'Libro Inicial',
          autor: 'Autor Inicial',
          isbn: '111111111',
          imagen: 'imagen-inicial.jpg',
          reseña: 'Reseña inicial',
        },
      ])
    );
    mockDbService.agregarLibro.and.returnValue(Promise.resolve());

    // Mock para AlertController
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }));

    // Mock para ModalController
    mockModalController = jasmine.createSpyObj('ModalController', ['create']);
    mockModalController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
        onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null })),
      })
    );

    TestBed.configureTestingModule({
      declarations: [MisLecturasPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ApiLibrosService, useValue: mockApiLibrosService },
        { provide: DbService, useValue: mockDbService },
        { provide: AlertController, useValue: mockAlertController },
        { provide: ModalController, useValue: mockModalController },
      ],
    }).compileComponents();

    // Mock para localStorage
    spyOn(localStorage, 'getItem').and.returnValue('test@user.com');

    fixture = TestBed.createComponent(MisLecturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los libros del usuario al inicializar', async () => {
    await component.ngOnInit();
    expect(mockDbService.getUserByEmail).toHaveBeenCalledWith('test@user.com');
    expect(mockDbService.obtenerLibros).toHaveBeenCalledWith(1);
    expect(component.misLecturas.length).toBe(1);
  });

  it('debería agregar un libro a la lista después de buscarlo', async () => {
    // Simula que la lista inicial está vacía
    component.misLecturas = [
      {
        titulo: 'Libro Inicial',
        autor: 'Autor Inicial',
        isbn: '111111111',
        imagen: 'imagen-inicial.jpg',
        resena: 'Reseña inicial',
      },
    ];
  
    // Configura el formulario para buscar un libro
    component.buscarForm.patchValue({ datoBusqueda: '123456789' });
  
    // Llama al método buscarLibro
    await component.buscarLibro();
  
    // Simula guardar el libro encontrado en la lista
    await component.guardarLibroDesdeAPI({
      titulo: 'Libro Prueba',
      autor: 'Autor Prueba',
      isbn: '123456789',
      imagen: 'url-imagen',
      resena: 'Reseña de prueba',
    });
  
    // Verifica que el servicio fue llamado con el parámetro correcto
    expect(mockApiLibrosService.buscarLibro).toHaveBeenCalledWith('123456789');
  
    // Verifica que ahora hay dos libros en la lista
    expect(component.misLecturas.length).toBe(2);
  
    // Verifica que el libro agregado sea el correcto
    expect(component.misLecturas[1]).toEqual(
      jasmine.objectContaining({
        titulo: 'Libro Prueba',
        autor: 'Autor Prueba',
        isbn: '123456789',
      })
    );
  });

  it('debería mostrar un mensaje de error si no se encuentra un usuario', async () => {
    mockDbService.getUserByEmail.and.returnValue(Promise.resolve(null));

    await component.ngOnInit();

    expect(mockAlertController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        header: 'Error',
        message: 'Usuario no encontrado. Por favor, inicia sesión nuevamente.',
      })
    );
  });
});
