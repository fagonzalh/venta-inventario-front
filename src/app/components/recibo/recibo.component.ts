import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {

  venta: any;
  devolucion_dinero: any;
  recibe_dinero = 0.00;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {},
    private matDialogRef: MatDialogRef<ReciboComponent>,
  ) { }

  ngOnInit(): void {
    this.venta = this.data;
    console.log(this.venta);
    this.calcularDevolucion(this.recibe_dinero);
  }


  calcularDevolucion(recibe: number) {
    this.devolucion_dinero = recibe - this.venta.total;
    this.devolucion_dinero = Math.round(this.devolucion_dinero * 100.0) / 100.0;
  }



}
