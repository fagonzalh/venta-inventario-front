import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ProductoService } from '../../services/producto.service';
import { MatTableDataSource } from '@angular/material/table';
import { Producto, Proveedor, BodegaIngreso } from '../../interfaces/interfaces';
import { ItemIngreso } from 'src/app/interfaces/interfaces';


@Component({
  selector: 'app-admin-inventario',
  templateUrl: './admin-inventario.component.html',
  styleUrls: ['./admin-inventario.component.css']
})
export class AdminInventarioComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['fecha_ingreso', 'observacion', 'bodega_id', 'proveedor_id', 'estado'];
  ingresosBodega: any;
  totalPages: any;

  productos: any;
  dataSource: MatTableDataSource<BodegaIngreso>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productoSrv: ProductoService
  ) { }

  ngOnInit(): void {
    this.getIngresos();
  }

  ngAfterViewInit() {

  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      return data.observacion.toLocaleLowerCase().includes(filter) ||
        data.estado.toLocaleLowerCase().includes(filter) ||
        data.bodega_id.nombre.toLocaleLowerCase().includes(filter) ||
        data.proveedor_id.nombre.toLocaleLowerCase().includes(filter);
    };
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  getProductos() {
    this.productoSrv.getProductos().subscribe(
      res => {
        console.log(res)
        this.productos = res.productos;

        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }


  getIngresos() {
    this.productoSrv.getIngresos().subscribe(
      (res: any) => {
        console.log(res)
        this.ingresosBodega = res.ingresos;


        this.dataSource = new MatTableDataSource(this.ingresosBodega);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      },
      error => {
        console.log(error)
      }
    )
  }

}
