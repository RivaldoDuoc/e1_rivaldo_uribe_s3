import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisLecturasPage } from './mis-lecturas.page';

const routes: Routes = [
  {
    path: '',
    component: MisLecturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisLecturasPageRoutingModule {}
