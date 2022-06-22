import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { VentaService } from '../../services/venta.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

declare var $: any;

@Component({
  selector: 'app-dialog-recibo',
  templateUrl: './dialog-recibo.component.html',
  styleUrls: ['./dialog-recibo.component.css']
})
export class DialogReciboComponent implements OnInit {

  venta: any;
  devolucion_dinero: any;
  recibe_dinero = 0.00;
  img: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    public dialogRef: MatDialogRef<DialogReciboComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private ventaService: VentaService
  ) { }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
    this.venta = this.data;
    this.calcularDevolucion(this.recibe_dinero);
  }


  calcularDevolucion(recibe: number) {
    this.devolucion_dinero = recibe - this.venta.total;
    this.devolucion_dinero = Math.round(this.devolucion_dinero * 100.0) / 100.0;
  }


  async finalizarVenta() {

    this.venta.recibe_dinero = this.recibe_dinero;
    this.venta.devolucion_dinero = this.devolucion_dinero;
    console.log(this.venta)

    this.ventaService.crearVenta(this.venta).subscribe(
      res => {
        console.log(res);
        this.print();
        this.dialogRef.close(this.venta);
      },
      error => {
        console.log(error)
      })

  }


  async print() {

    let printContents, popupWin;
    printContents = document.getElementById('content_pdf').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    await popupWin.document.write(`
      <html>            
      <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Print tab</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">


      <style>
          .recibo {
              margin: auto;
              overflow: hidden;
              font-size: 9px;
              border: 1px solid lightgrey;
              padding: 2%;
              border-radius: 20px;
              box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px, rgb(0 0 0 / 30%) 0px 3px 7px -3px;
          }

          p,
          h5 {
              font-size: 12px;
              margin: 1px;
          }

          .list_footer p {
              font-family: monospace;
              margin-bottom: 15px;
          }

          .flex-between {
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          .text-center {
              text-align: center;
          }

          .list_header,
          .list_datos,
          .list_pedidos,
          .list_price,
          .list_footer {
              border-bottom: 2px solid #545353;
              border-bottom-style: dotted;
              padding: 3% 0px;
          }

          .list_footer {
              border-bottom: 0;
          }

          .text-tks {
              font-size: 11px;
          }

          /* #content_pdf {
              height: 100%;
          } */


          .total {
              font-size: 15px;
          }


          .header__item__recibo,
          .item-recibo {
              display: grid;
              grid-template-columns: 60% 20% 20%;

          }
      </style>
      </head>

      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
