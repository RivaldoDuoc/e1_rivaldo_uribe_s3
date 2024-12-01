import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';
import { Storage } from '@ionic/storage-angular';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
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
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize storage on ngOnInit', async () => {
    await component.ngOnInit();
    expect(mockStorage.create).toHaveBeenCalled(); // Verifica que se inicialice el almacenamiento
    expect(mockDbService.createDatabase).toHaveBeenCalled(); // Verifica que se crea la base de datos
  });

  it('should log out and navigate to login', async () => {
    await component.logout();
    expect(mockMenuController.close).toHaveBeenCalled(); // Verifica que se cierre el menú
    expect(mockStorage.remove).toHaveBeenCalledWith('currentUser'); // Verifica que se elimine el usuario
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']); // Verifica que redirige al login
  });

  it('should navigate to CRUD if user is admin', () => {
    component.isAdmin = true;
    component.navegarCRUD();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/crud-usuarios']); // Verifica que navega al CRUD
  });

  it('should not navigate to CRUD if user is not admin', () => {
    component.isAdmin = false;
    component.navegarCRUD();
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Verifica que no navega
  });
});
