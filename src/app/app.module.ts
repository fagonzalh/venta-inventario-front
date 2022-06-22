import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { VentaComponent } from './components/venta/venta.component';
import { HistorialComponent } from './components/historial/historial.component';
import { ReciboComponent } from './components/recibo/recibo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Error404Component } from './components/error404/error404.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScriptLoaderModule } from 'ngx-script-loader';
import { PipesModule } from './pipes/pipes.module';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { TestComponent } from './components/test/test.component';
import { MaterialModule } from './material/material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DialogClienteComponent } from './components/dialog-cliente/dialog-cliente.component';
import { DialogReciboComponent } from './components/dialog-recibo/dialog-recibo.component';
import { IonicModule } from '@ionic/angular';
import { NgxPrintModule } from 'ngx-print';
import { AdminCategoriasComponent } from './components/admin-categorias/admin-categorias.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { LabComponent } from './components/lab/lab.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AdminProveedoresComponent } from './components/admin-proveedores/admin-proveedores.component';
import { AdminIngresosComponent } from './components/admin-ingresos/admin-ingresos.component';
import { AdminSalidasComponent } from './components/admin-salidas/admin-salidas.component';
import { AdminInventarioComponent } from './components/admin-inventario/admin-inventario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VentaComponent,
    HistorialComponent,
    ReciboComponent,
    Error404Component,
    NavComponent,
    FacturacionComponent,
    ClientesComponent,
    TestComponent,
    DialogClienteComponent,
    DialogReciboComponent,
    AdminCategoriasComponent,
    AdminProductosComponent,
    LabComponent,
    AdminUsersComponent,
    DialogConfirmComponent,
    AdminProveedoresComponent,
    AdminIngresosComponent,
    AdminSalidasComponent,
    AdminInventarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ScriptLoaderModule,
    PipesModule,
    MaterialModule,
    NgxPrintModule,
    ReactiveFormsModule,
    IonicModule.forRoot()

  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
