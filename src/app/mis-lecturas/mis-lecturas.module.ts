import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisLecturasPageRoutingModule } from './mis-lecturas-routing.module';

import { MisLecturasPage } from './mis-lecturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisLecturasPageRoutingModule
  ],
  declarations: [MisLecturasPage]
})
export class MisLecturasPageModule {}
