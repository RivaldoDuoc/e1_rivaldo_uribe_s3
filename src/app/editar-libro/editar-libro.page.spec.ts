import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditarLibroPage } from './editar-libro.page';

describe('EditarLibroPage', () => {
  let componente: EditarLibroPage;
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
    componente = fixture.componentInstance;

    // Inicializa el Input del componente
    componente.libro = { 
      titulo: 'Libro de prueba', 
      autor: 'Autor de prueba', 
      isbn: '123456',
      resena: '',
      valoracion: 0,
      imagen: '',
      comentarios: '',
      categoria: 'Otras categorías' // Campo inicializado
    };

    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería cerrar el modal con el libro editado al guardar los cambios', async () => {
    componente.libroForm.patchValue({
      titulo: 'Nuevo Título',
      autor: 'Nuevo Autor',
      isbn: '654321',
      categoria: 'Otras categorías', // Asegurar que la categoría está incluida
    });

    await componente.guardarCambios();

    expect(mockModalController.dismiss).toHaveBeenCalledWith({
      titulo: 'Nuevo Título',
      autor: 'Nuevo Autor',
      isbn: '654321',
      resena: '',
      valoracion: 0,
      imagen: '',
      comentarios: '',
      categoria: 'Otras categorías', // Incluir categoría en la comparación
    });
  });

  it('debería cerrar el modal sin datos al cancelar', async () => {
    await componente.cancelar();

    expect(mockModalController.dismiss).toHaveBeenCalled();
  });
});
