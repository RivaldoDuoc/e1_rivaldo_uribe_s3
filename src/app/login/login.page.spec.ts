import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockStorage: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    // Crear un mock para Storage
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    mockStorage.create.and.returnValue(Promise.resolve(mockStorage)); // Devuelve una instancia mock de Storage
    mockStorage.get.and.returnValue(Promise.resolve(null));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule, // Para soporte de ngModel
      ],
      providers: [
        { provide: Storage, useValue: mockStorage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar "email" y "password" como cadenas vacías', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('debería mostrar un botón de login deshabilitado cuando loading es true', () => {
    component.loading = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('ion-button');
    expect(button.disabled).toBeTrue();
  });

  it('debería llamar a la función login al hacer clic en el botón', () => {
    spyOn(component, 'login');

    // Simula clic en el botón
    const button = fixture.nativeElement.querySelector('ion-button');
    button.click();

    expect(component.login).toHaveBeenCalled();
  });

  it('debería mostrar el spinner cuando loading es true', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('ion-spinner');
    expect(spinner).toBeTruthy();
  });
});
