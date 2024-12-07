import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MiPerfilPage } from './mi-perfil.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DbService } from '../services/db.service';
import { Storage } from '@ionic/storage-angular';

describe('MiPerfilPage', () => {
  let component: MiPerfilPage;
  let fixture: ComponentFixture<MiPerfilPage>;
  let mockStorage: any;
  let mockDbService: any;
  let mockMatDialog: any;

  beforeEach(waitForAsync(() => {
    // Mock para el servicio Storage
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    mockStorage.get.and.returnValue(Promise.resolve('test@user.com'));

    // Mock para el servicio DbService
    mockDbService = jasmine.createSpyObj('DbService', [
      'initializeDatabase',
      'getUserByEmail',
      'getAllUsers',
    ]);
    mockDbService.initializeDatabase.and.returnValue(Promise.resolve());
    mockDbService.getUserByEmail.and.returnValue(
      Promise.resolve({
        id: 1,
        nombre: 'Test',
        apellidos: 'User',
        email: 'test@user.com',
        tipoUsuario: 'user',
      })
    );
    mockDbService.getAllUsers.and.returnValue(Promise.resolve([]));

    // Mock para el componente MatDialog
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatDialog.open.and.returnValue({ afterClosed: () => of(true) });

    TestBed.configureTestingModule({
      declarations: [MiPerfilPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Storage, useValue: mockStorage },
        { provide: DbService, useValue: mockDbService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => 'false' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MiPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos del usuario al inicializar', async () => {
    await component.ngOnInit();

    expect(mockStorage.get).toHaveBeenCalledWith('usuarioEmail');
    expect(mockDbService.getUserByEmail).toHaveBeenCalledWith('test@user.com');
    expect(component.perfilForm.value.nombre).toBe('Test');
    expect(component.perfilForm.value.apellidos).toBe('User');
  });


  it('debería guardar los datos correctamente', async () => {
    component.perfilForm.patchValue({
      nombre: 'Nombre Test',
      apellidos: 'Apellidos Test',
      fechaNacimiento: '2000-01-01',
      email: 'test@user.com',
      password: '1234',
      confirmPassword: '1234',
    });

    await component.guardarPerfil();

    expect(mockDbService.getUserByEmail).toHaveBeenCalled();
    expect(component.perfilForm.valid).toBeTrue();
  });

  it('debería mostrar un mensaje de error si las contraseñas no coinciden', () => {
    component.perfilForm.patchValue({
      password: '1234',
      confirmPassword: '5678',
    });

    expect(component.perfilForm.hasError('passwordMismatch')).toBeTrue();
  });
});
