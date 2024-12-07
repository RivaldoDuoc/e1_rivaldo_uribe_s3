import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { Storage } from '@ionic/storage-angular';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let mockRouter: any;
  let mockStorage: any;

  beforeEach(() => {
    // Mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    // Mock de Storage
    mockStorage = jasmine.createSpyObj('Storage', ['get']);
    mockStorage.get.and.returnValue(Promise.resolve({ tipoUsuario: 'admin' })); // Valor por defecto: usuario admin

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: Router, useValue: mockRouter }, // Provisión del mock de Router
        { provide: Storage, useValue: mockStorage }, // Provisión del mock de Storage
      ],
    });

    guard = TestBed.inject(AdminGuard); // Inyección del guard
  });

  it('debería crear el guard', () => {
    expect(guard).toBeTruthy();
  });

  it('debería permitir el acceso a un usuario administrador', async () => {
    // Configurar Storage para devolver un usuario administrador
    mockStorage.get.and.returnValue(Promise.resolve({ tipoUsuario: 'admin' }));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue(); // Verifica que permite el acceso
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Verifica que no se redirige
  });

  it('debería negar el acceso a un usuario que no es administrador', async () => {
    // Configurar Storage para devolver un usuario no administrador
    mockStorage.get.and.returnValue(Promise.resolve({ tipoUsuario: 'user' }));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse(); // Verifica que niega el acceso
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']); // Verifica que redirige a /home
  });

  it('debería negar el acceso si no se encuentra un usuario', async () => {
    // Configurar Storage para devolver null (sin usuario)
    mockStorage.get.and.returnValue(Promise.resolve(null));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse(); // Verifica que niega el acceso
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']); // Verifica que redirige a /home
  });
});
