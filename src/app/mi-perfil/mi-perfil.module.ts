import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MiPerfilPageRoutingModule } from './mi-perfil-routing.module';
import { MiPerfilPage } from './mi-perfil.page';
import { ConfirmacionDialogComponent } from '../components/confirmacion-dialog/confirmacion-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MiPerfilPageRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  declarations: [MiPerfilPage, ConfirmacionDialogComponent],
})
export class MiPerfilPageModule {}
