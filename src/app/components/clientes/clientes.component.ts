import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/interfaces';
import { ClienteService } from '../../services/cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {

  cliente: Cliente = {
    nombres: '',
    apellidos: '',
    identificacion: null,
    direccion: '',
    celular: null,
    email: ''
  }

  clienteReset: Cliente = {
    nombres: '',
    apellidos: '',
    identificacion: null,
    direccion: '',
    celular: null,
    email: ''
  }

  clienteFinal: Cliente = {
    identificacion: 9999999999999,
  }

  constructor(
    private clienteSrv: ClienteService,
  ) { }

  ngOnInit() {
    this.buscarCliente();
  }

  buscarCliente(val?: any) {

    if (val === 'final') {
      this.clienteSrv.getCliente(this.clienteFinal.identificacion).subscribe(
        res => {
          if (res['ok'] == false) {
            console.log('error')
          }
          this.cliente = res['client'];
        }
      );
    }
    const ident = document.getElementById('input__identificacion');
    ident.addEventListener('keydown', (e: any) => {
      if (e.key === 'Enter') {
        const iden = e.target.value;
        this.clienteSrv.getCliente(iden).subscribe(
          res => {
            if (res['ok'] == false) {
              console.log('erro')
            }
            this.cliente = res['client'];
          }
        );
      }
    })
  }

  cerrarModal() {
  }

  registrarCliente(cliente: NgForm) {
  }

}
