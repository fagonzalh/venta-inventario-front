import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Venta } from 'src/app/interfaces/interfaces';
import { VentaService } from '../../services/venta.service';
import { ReciboComponent } from '../recibo/recibo.component';

declare var $: any;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  displayedColumns: string[] = ['created_at', 'cliente_id', 'observacion', 'mesa', 'total', 'actions'];
  arrVentas: any;
  dataSource: MatTableDataSource<Venta>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ventaService: VentaService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.ventaService.getVentas().subscribe(
      res => {
        this.arrVentas = res;
        console.log(this.arrVentas)
        this.dataSource = new MatTableDataSource(this.arrVentas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  verVenta(venta: Venta) {
    console.log(venta);

    let dialogRecibo = this.matDialog.open(ReciboComponent, {
      disableClose: false,
      data: venta,
      height: 'auto',
      width: '350px'
    })

    // dialogRecibo.afterClosed().subscribe(res => {
    //   console.log(res);
    // })


  }


}



