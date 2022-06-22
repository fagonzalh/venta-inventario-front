import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  apiUrl = environment.api;
  token: '';


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }


  crearVenta(venta: {}) {
    console.log(venta)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.userService.token);

    return this.http.post(`${this.apiUrl}/producto/venta`, venta, { headers });
  }

  getVentas() {
    return this.http.post(`${this.apiUrl}/producto/ventas`, {});
  }


}
