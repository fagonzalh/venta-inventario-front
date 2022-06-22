import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/interfaces';
import { ClienteService } from 'src/app/services/cliente.service';
import { UserService } from '../../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-cliente',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.css']
})
export class DialogClienteComponent implements OnInit, OnDestroy {

  disabledClienteFinal: boolean = true;
  keyInput = '';


  cliente: Cliente = {
    nombres: '',
    apellidos: '',
    identificacion: null,
    direccion: '',
    celular: null,
    email: '',
    _id: ''
  }

  clienteReset: Cliente = {
    nombres: '',
    apellidos: '',
    identificacion: null,
    direccion: '',
    celular: null,
    email: '',
    _id: ''
  }

  clienteFinal: Cliente = {
    identificacion: 9999999999,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {},
    private matDialogRef: MatDialogRef<DialogClienteComponent>,
    private clienteSrv: ClienteService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.matDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  }

  ngOnDestroy(): void {

  }

  eventKeySearch(e: any) {
    if (e.target.value.length > 4) {
      this.buscarCliente('', e);
    }
  }

  buscarCliente(val?: string, evento?: any) {
    evento.preventDefault()

    if (val === 'final') {
      this.clienteSrv.getCliente(this.clienteFinal.identificacion).subscribe(
        res => {
          console.log(res)
          this.cliente = res.client
        }
      );
    } else {
      const iden = evento.target['value'];
      this.clienteSrv.getCliente(iden).subscribe(
        res => {
          if (res.ok === true) {
            this.cliente = res.client;
            this.userService.notificacion('Ok!', '', 'snackbar__success');
          } else {
            this.userService.notificacion('No existe cliente con esa identificación!', '', 'snackbar__warning');
            this.cliente = {}
            this.cliente.identificacion = evento.target.value;
          }
        }, error => {
          console.log(error);
          this.userService.notificacion('Error!...Intente de nuevo. ', '', 'snackbar__error');
        }
      );
    }
  }


  addClient(cliente?: NgForm) {
    if (cliente.invalid) return;
    this.matDialogRef.close(this.cliente);

  }


  registerClient(cliente?: NgForm) {
    this.clienteSrv.registroCliente(cliente.value).subscribe(res => {
      if (res.ok === true) {
        this.userService.notificacion('Cliente creado!', '', 'snackbar__success');
        this.matDialogRef.close(res.cliente);

      } else if (res.keyValue.identificacion) {
        this.userService.notificacion('Cliente ya existe!', '', 'snackbar__warning');
      }
    }, error => {
      console.log(error);
      this.userService.notificacion('Error!...Intente de nuevo. ', '', 'snackbar__error');
    })
  }

  cerrarModal() {
    this.matDialogRef.close(null);
  }

  clear(e: any) {
    e.preventDefault();
    this.cliente = this.clienteReset
  }

  tabChanged(a: NgForm, b: NgForm, evento: any) {
    a.reset()
    b.reset()
    this.cliente = {}
    evento.tab.textLabel != 'Nuevo' ? this.disabledClienteFinal = false : this.disabledClienteFinal = true;
  }

}
