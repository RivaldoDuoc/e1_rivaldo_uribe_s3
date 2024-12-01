import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditarLibroPage } from './editar-libro.page';

describe('EditarLibroPage', () => {
  let component: EditarLibroPage;
  let fixture: ComponentFixture<EditarLibroPage>;
  let mockModalController: any;

  beforeEach(waitForAsync(() => {
    // Mock de ModalController
    mockModalController = jasmine.createSpyObj('ModalController', ['dismiss']);
    mockModalController.dismiss.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [EditarLibroPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule], // Importa módulos necesarios
      providers: [
        { provide: ModalController, useValue: mockModalController }, // Provisión del mock de ModalController
        FormBuilder, // Provisión de FormBuilder
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarLibroPage);
    component = fixture.componentInstance;

    // Inicializa el Input del componente
    component.libro = { titulo: 'Libro de prueba', autor: 'Autor de prueba', isbn: '123456' };

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss modal with edited book on guardarCambios', async () => {
    component.libroForm.patchValue({
      titulo: 'Nuevo Título',
      autor: 'Nuevo Autor',
      isbn: '654321',
    });
  
    await component.guardarCambios();
  
    expect(mockModalController.dismiss).toHaveBeenCalledWith({
      titulo: 'Nuevo Título',
      autor: 'Nuevo Autor',
      isbn: '654321',
      resena: '',
      valoracion: 0,
      imagen: '',
      comentarios: '',
    });
  });

  it('should dismiss modal without data on cancelar', async () => {
    await component.cancelar();

    expect(mockModalController.dismiss).toHaveBeenCalled();
  });
});
