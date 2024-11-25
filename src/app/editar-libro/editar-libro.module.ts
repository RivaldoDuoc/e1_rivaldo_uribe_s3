import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { EditarLibroPageRoutingModule } from './editar-libro-routing.module';
import { EditarLibroPage } from './editar-libro.page';

@NgModule({
  declarations: [EditarLibroPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Agregar aquí
    IonicModule,
    EditarLibroPageRoutingModule,
  ],
})
export class EditarLibroPageModule {}
