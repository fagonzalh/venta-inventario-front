/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  token: string = null;
  urlApi = environment.api;
  cliente: Cliente = {};


  constructor(
    private http: HttpClient,
    private usuarioSrv: UserService
  ) {
  }

  registroCliente(client: {}) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);
    return this.http.post<any>(`${this.urlApi}/producto/cliente`, client, { headers })
  }


  getCliente(identificacion: any) {
    return this.http.get<any>(`${this.urlApi}/producto/cliente/${identificacion}`);
  }


  crearVenta(venta: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.usuarioSrv.token);

    return this.http.post<any>(`${this.urlApi}/producto/venta`, venta, { headers });
  }



}
