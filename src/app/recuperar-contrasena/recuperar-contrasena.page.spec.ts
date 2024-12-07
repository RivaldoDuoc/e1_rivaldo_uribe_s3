import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RecuperarContrasenaPage } from './recuperar-contrasena.page';

describe('RecuperarContrasenaPage', () => {
  let component: RecuperarContrasenaPage;
  let fixture: ComponentFixture<RecuperarContrasenaPage>;
  let mockFormBuilder: FormBuilder;

  beforeEach(waitForAsync(() => {
    // Mock del FormBuilder
    mockFormBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [RecuperarContrasenaPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FormBuilder, useValue: mockFormBuilder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.recuperarForm).toBeDefined();
    expect(component.recuperarForm.get('email')).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si el email no es válido', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('correo_invalido');
    expect(component.recuperarForm.invalid).toBeTrue();
  });

  it('debería marcar el formulario como válido si el email es correcto', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('correo@valido.com');
    expect(component.recuperarForm.valid).toBeTrue();
  });

  it('debería llamar al método recuperarContrasena al enviar el formulario', () => {
    spyOn(component, 'recuperarContrasena');
    component.recuperarForm.get('email')?.setValue('correo@valido.com');
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));

    expect(component.recuperarContrasena).toHaveBeenCalled();
  });
});
