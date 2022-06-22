import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  urlApi = environment.api;
  productos$ = new EventEmitter<any>();
  datosFinalVenta$ = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private usuarioSrv: UserService
  ) { }


  getCategorias() {
    return this.http.get<any>(`${this.urlApi}/producto/categorias`);
  }



  createCategoria(cat: {}) {
    return this.http.post<any>(`${this.urlApi}/producto/create-categoria`, cat);
  }


  editCategoria(data: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.put(`${this.urlApi}/producto/categoria-update`, data, { headers });
  }

  deleteCategoria(id: string) {
    return this.http.delete(`${this.urlApi}/producto/categorias/${id}`);
  }


  getProductosByCategoria(idCat: any) {
    return this.http.get<any>(`${this.urlApi}/producto/${idCat}`);
  }


  getProductos() {
    return this.http.get<any>(`${this.urlApi}/producto/list`);
  }

  getProducto(codigo: string) {
    return this.http.get<any>(`${this.urlApi}/producto/find/${codigo}`);
  }

  createProducto(prod: {}) {
    return this.http.post<any>(`${this.urlApi}/producto/create-producto`, prod);
  }

  editProducto(data: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.post(`${this.urlApi}/producto/update`, data, { headers });
  }


  deleteProducto(id: string) {
    return this.http.delete(`${this.urlApi}/producto/${id}`);
  }


  //Inicio Proveedor
  getProveedores() {
    return this.http.post<any>(`${this.urlApi}/producto/proveedores`, {});
  }

  createProveedor(prov: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.post<any>(`${this.urlApi}/producto/proveedor`, prov, { headers });
  }

  editProveedor(data: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.put(`${this.urlApi}/producto/proveedor-update`, data, { headers });
  }

  deleteProveedor(id: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.delete(`${this.urlApi}/producto/proveedor/${id}`, { headers });
  }



  //Inicio Bodega
  getBodegas() {
    return this.http.post<any>(`${this.urlApi}/producto/bodegas`, {});
  }

  createBodega(prov: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.post<any>(`${this.urlApi}/producto/bodega`, prov, { headers });
  }

  editBodega(data: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.put(`${this.urlApi}/producto/bodega-update`, data, { headers });
  }

  deleteBodega(id: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.delete(`${this.urlApi}/producto/bodega/${id}`, { headers });
  }


  /** CREAR INGRESO */

  createIngreso(data: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.post(`${this.urlApi}/producto/ingreso-bodega`, data, { headers });
  }

  getIngresos(data?: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);


    return this.http.post(`${this.urlApi}/producto/ingresos-bodega`, data, { headers })
  }

}
