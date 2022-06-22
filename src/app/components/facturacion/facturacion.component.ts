import { DialogReciboComponent } from './../dialog-recibo/dialog-recibo.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Subscription } from 'rxjs';
import { ClientesComponent } from '../clientes/clientes.component';
import { Cliente } from 'src/app/interfaces/interfaces';
import { ClienteService } from '../../services/cliente.service';
import { ReciboComponent } from '../recibo/recibo.component';
import { DialogClienteComponent } from '../dialog-cliente/dialog-cliente.component';
import { UserService } from 'src/app/services/user.service';
import { Venta } from '../../interfaces/interfaces';

declare var $: any;


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css'],
})
export class FacturacionComponent implements OnInit {


  @Output() facturaFinal = new EventEmitter();
  productoObsrv: Subscription;


  nombreFactura = 'Agregar Cliente';
  mesa: any;
  productos: any[] = [];
  enableObsv = false;
  cliente: Cliente = null;
  venta: Venta = {};

  //Variables valores a cobrar
  fac__subtotal = 0.00;
  fac__descuento = 0.00;
  fac__total = 0.00;


  constructor(
    private prodSrv: ProductoService,
    private clientSrv: ClienteService,
    private matDialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.productoObsrv = this.prodSrv.productos$.subscribe(res => {
      this.addProd(res);
    })

  }

  async addProd(producto: any) {
    const exists = await this.productos.find(pro => pro._id === producto._id);

    if (exists) {
      exists.cantidad += 1;
      exists.subtotal = exists.cantidad * parseFloat(exists.precio);
      exists.subtotal = Math.round(exists.subtotal * 100.0) / 100.0;
      exists.subtotal = exists.subtotal.toFixed(2);
      this.generarValoresCobrar(this.productos);

      return;
    }
    this.productos.push({ ...producto });
    this.generarValoresCobrar(this.productos);

  }


  ngOnDestroy(): void {
    this.productoObsrv.unsubscribe();
  }

  async mostrarModal() {

    let dialogClient = this.matDialog.open(DialogClienteComponent, {
      disableClose: true
    });
    dialogClient.afterClosed().subscribe(res => {
      console.log(res);
      if (res != null) {
        this.cliente = res;
        this.nombreFactura = `${this.cliente.nombres} ${this.cliente.apellidos}`
        this.userService.notificacion('Cliente seleccionado!', '', 'snackbar__success');
      } else {
        this.cliente = null;
        this.userService.notificacion('Cliente NO seleccionado!', 'Intente Nuevamente', 'snackbar__warning');
        this.nombreFactura = 'Agregar Cliente';
      }
    })
  }


  generarValoresCobrar(productos: any) {
    this.borrarValoresCobrar();

    productos.map((pro: any) => {
      this.fac__subtotal = this.fac__subtotal + parseFloat(pro['subtotal']);
      this.fac__subtotal = Math.round(this.fac__subtotal * 100.0) / 100.0;
      this.fac__total = this.fac__subtotal;
    })
  }

  borrarValoresCobrar() {
    this.fac__subtotal = 0.00;
    this.fac__descuento = 0.00;
    this.fac__total = 0.00;
  }

  restarProd(pro: any) {
    if (pro.cantidad >= 1) {
      pro.cantidad -= 1;
      pro.subtotal = pro.precio * pro.cantidad;
      pro.subtotal = pro.subtotal.toFixed(2);
    }

    this.generarValoresCobrar(this.productos);
  }

  eliminarOrden() {
    this.borrarValoresCobrar();
    this.productos = [];
    this.cliente = null;
    this.enableObsv = false;
    this.venta.observacion = '';
    this.venta.mesa = null;
    this.venta = {}
  }


  async cobrarOrden() {

    this.venta.cliente = this.cliente
    this.venta.cliente_id = this.cliente._id;
    this.venta.productos = this.productos;
    this.venta.observacion = this.venta.observacion || '';
    this.venta.mesa = this.mesa;
    this.venta.subtotal = this.fac__subtotal;
    this.venta.total = this.fac__total;

    console.log(this.venta)
    let dialogRecibo = this.matDialog.open(DialogReciboComponent, {
      disableClose: false,
      data: this.venta,
      height: 'auto',
      width: '750px',
    })

    dialogRecibo.afterClosed().subscribe(res => {
      this.userService.notificacion('Venta realizada con éxito!', '', 'snackbar__success');
      this.eliminarOrden()
    })
  }

  selectMesa(e: any) {
    this.mesa = e.detail.value;
  }
  eliminarProducto(producto: any) {
    this.productos = this.productos.filter(prod => prod._id != producto._id);
    this.generarValoresCobrar(this.productos);
  }

}
