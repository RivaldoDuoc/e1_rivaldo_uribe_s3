import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from './confirmacion-dialog.component';

describe('ConfirmacionDialogComponent', () => {
  let component: ConfirmacionDialogComponent;
  let fixture: ComponentFixture<ConfirmacionDialogComponent>;
  let mockDialogRef: any;

  beforeEach(waitForAsync(() => {
    // Mock para MatDialogRef
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ConfirmacionDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }, // Proveer el mock del diálogo
        { provide: MAT_DIALOG_DATA, useValue: { titulo: 'Confirmación', mensaje: '¿Estás seguro?' } }, // Datos simulados
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título y mensaje proporcionados', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titulo = compiled.querySelector('h2')?.textContent;
    const mensaje = compiled.querySelector('mat-dialog-content p')?.textContent;

    expect(titulo).toBe('Confirmación'); // Verifica que el título sea correcto
    expect(mensaje).toBe('¿Estás seguro?'); // Verifica que el mensaje sea correcto
  });

  it('debería cerrar el diálogo con false al cancelar', () => {
    component.onCancelar();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false); // Verifica que se cierra con "false"
  });

  it('debería cerrar el diálogo con true al confirmar', () => {
    component.onConfirmar();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true); // Verifica que se cierra con "true"
  });
});

