import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MisLecturasPageRoutingModule } from './mis-lecturas-routing.module';
import { MisLecturasPage } from './mis-lecturas.page';
import { EditarLibroPageModule } from '../editar-libro/editar-libro.module'; // Importar módulo

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MisLecturasPageRoutingModule,
    EditarLibroPageModule, // Agregar aquí
  ],
  declarations: [MisLecturasPage],
})
export class MisLecturasPageModule {}
