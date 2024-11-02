import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion-dialog',
  templateUrl: './confirmacion-dialog.component.html',
})
export class ConfirmacionDialogComponent {
  constructor(
    // Referencia al diálogo para poder cerrarlo o pasar datos de vuelta
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    // Inyecta los datos recibidos en el diálogo, que incluyen título y mensaje
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}

  // Método que se llama al confirmar, cierra el diálogo y devuelve 'true' como resultado
  onConfirmar(): void {
    this.dialogRef.close(true);
  }

  // Método que se llama al cancelar, cierra el diálogo y devuelve 'false' como resultado
  onCancelar(): void {
    this.dialogRef.close(false);
  }
}
