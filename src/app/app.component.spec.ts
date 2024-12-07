import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';
import { Storage } from '@ionic/storage-angular';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let componente: AppComponent;
  let mockStorage: any;
  let mockMenuController: any;
  let mockRouter: any;
  let mockDbService: any;

  beforeEach(waitForAsync(() => {
    // Mock de Storage
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'remove']);
    mockStorage.create.and.returnValue(Promise.resolve());
    mockStorage.get.and.returnValue(Promise.resolve(null));
    mockStorage.remove.and.returnValue(Promise.resolve());

    // Mock de MenuController
    mockMenuController = jasmine.createSpyObj('MenuController', ['close']);
    mockMenuController.close.and.returnValue(Promise.resolve());

    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de DbService
    mockDbService = jasmine.createSpyObj('DbService', ['createDatabase']);
    mockDbService.createDatabase.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Storage, useValue: mockStorage },
        { provide: MenuController, useValue: mockMenuController },
        { provide: Router, useValue: mockRouter },
        { provide: DbService, useValue: mockDbService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para ignorar elementos personalizados como <ion-menu>
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    componente = fixture.componentInstance;
  }));

  it('debería crear la aplicación', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el almacenamiento en ngOnInit', async () => {
    await componente.ngOnInit();
    expect(mockStorage.create).toHaveBeenCalled(); // Verifica que se inicialice el almacenamiento
    expect(mockDbService.createDatabase).toHaveBeenCalled(); // Verifica que se crea la base de datos
  });

  it('debería cerrar sesión y redirigir al login', async () => {
    await componente.logout();
    expect(mockMenuController.close).toHaveBeenCalled(); // Verifica que se cierre el menú
    expect(mockStorage.remove).toHaveBeenCalledWith('currentUser'); // Verifica que se elimine el usuario
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']); // Verifica que redirige al login
  });

  it('debería navegar al CRUD si el usuario es administrador', () => {
    componente.isAdmin = true;
    componente.navegarCRUD();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/crud-usuarios']); // Verifica que navega al CRUD
  });

  it('no debería navegar al CRUD si el usuario no es administrador', () => {
    componente.isAdmin = false;
    componente.navegarCRUD();
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Verifica que no navega
  });
});
