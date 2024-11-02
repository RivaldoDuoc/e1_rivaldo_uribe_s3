import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion-dialog',
  templateUrl: './confirmacion-dialog.component.html',
})
export class ConfirmacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}

  onConfirmar(): void {
    this.dialogRef.close(true);
  }

  onCancelar(): void {
    this.dialogRef.close(false);
  }
}
