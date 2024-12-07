import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard'; 

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  
  {
    path: 'mis-lecturas',
    loadChildren: () => import('./mis-lecturas/mis-lecturas.module').then(m => m.MisLecturasPageModule),
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./mi-perfil/mi-perfil.module').then(m => m.MiPerfilPageModule),
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then(
      m => m.RecuperarContrasenaPageModule
    ),
  },
  {
    path: 'crud-usuarios',
    loadChildren: () => import('./crud-usuarios/crud-usuarios.module').then(
      m => m.CrudUsuariosPageModule
    ),
    canActivate: [AdminGuard], // Protegido por el guard
  },
  {
    path: 'editar-libro',
    loadChildren: () => import('./editar-libro/editar-libro.module').then( m => m.EditarLibroPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
