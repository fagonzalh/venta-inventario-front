import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { HistorialComponent } from './components/historial/historial.component';
import { UserGuard } from './guards/user.guard';
import { VentaComponent } from './components/venta/venta.component';
import { TestComponent } from './components/test/test.component';
import { AdminCategoriasComponent } from './components/admin-categorias/admin-categorias.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { LabComponent } from './components/lab/lab.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { UserGuardAdmin } from './guards/user.guard.admin';
import { AdminProveedoresComponent } from './components/admin-proveedores/admin-proveedores.component';
import { AdminIngresosComponent } from './components/admin-ingresos/admin-ingresos.component';
import { AdminSalidasComponent } from './components/admin-salidas/admin-salidas.component';
import { AdminInventarioComponent } from './components/admin-inventario/admin-inventario.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/venta'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'venta',
    component: VentaComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'categorias',
    component: AdminCategoriasComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'usuarios',
    component: AdminUsersComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'productos',
    component: AdminProductosComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'proveedores',
    component: AdminProveedoresComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'ingresos',
    component: AdminIngresosComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'salidas',
    component: AdminSalidasComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'inventario',
    component: AdminInventarioComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'test',
    component: TestComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'lab',
    component: LabComponent,
    canActivate: [UserGuard]
  },
  {
    path: '**',
    component: Error404Component,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
