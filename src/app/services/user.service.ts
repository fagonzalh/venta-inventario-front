import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/interfaces';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ScriptService } from 'ngx-script-loader';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})


export class UserService {

  apiUrl = environment.api;
  token: any = '';
  token_valid = false;
  usuario: User = {};
  user$ = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private scriptService: ScriptService,
    private _snackBar: MatSnackBar

  ) {
    this.validaToken()
  }


  getUsers() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.token);
    return this.http.get(`${this.apiUrl}/user/list`, { headers });
  }

  login(data: any) {

    return new Promise(resolve => {

      this.http.post<any>(`${this.apiUrl}/user/login`, data)
        .subscribe(async res => {

          if (res['ok']) {
            console.log(res);
            this.token_valid = res.valid;
            await this.guardarToken(res['token']);
            resolve(true);
          } else {
            this.token = null;
            this.token_valid = false;
            localStorage.clear();
            resolve(false);
          }
        });
    });
  }

  async guardarToken(token: string) {
    this.token = token;
    await localStorage.setItem('token', this.token);

    await this.validaToken();
  }

  async validaToken(): Promise<boolean> {

    await this.cargarToken();
    if (!this.token) {
      this.router.navigate(['/login'])
      return Promise.resolve(false);
    }


    return new Promise<boolean>(resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get<any>(`${this.apiUrl}/user/`, { headers })
        .subscribe(resp => {
          if (resp['ok']) {
            this.usuario = resp.user;
            this.token_valid = resp.valid;
            //this.user$.emit(this.usuario);
            resolve(true);
          } else {
            this.router.navigate(['/login'])
            localStorage.clear();
            resolve(false);
          }

        });


    });

  }


  async isAdmin(): Promise<boolean> {

    return new Promise<boolean>(resolve => {


      if (this.usuario.role == 'ADMIN') {
        resolve(true);
      } else {
        resolve(false);
        this.router.navigateByUrl('/venta');
      }

    });

  }


  async cargarToken() {

    this.token = await localStorage.getItem('token') || null;

  }

  logout() {
    this.token = null;
    this.usuario = {};
    this.token_valid = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loadJS() {
    this.scriptService.runScript('../../assets/js/stisla.js').subscribe(res => console.log('Carga js OK'))
    this.scriptService.runScript('../../assets/js/scripts.js').subscribe(res => console.log('Carga js OK'))
    this.scriptService.runScript('../../assets/js/custom.js').subscribe(res => console.log('Carga js OK'))
  }


  createUser(user: {}) {
    console.log(this.token);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.token);
    return this.http.post<any>(`${this.apiUrl}/user/create-user`, user, { headers });
  }

  updateUser(user: {}) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.token);
    return this.http.post<any>(`${this.apiUrl}/user/update`, user, { headers });
  }

  deleteUser(id: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-token', this.token);
    return this.http.delete<any>(`${this.apiUrl}/user/${id}`, { headers });
  }

  notificacion(msg1: string, msg2?: string, classes?: string) {
    this._snackBar.open(msg1, msg2, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 2500,
      panelClass: classes
    });
  }
}
