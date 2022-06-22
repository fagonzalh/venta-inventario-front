import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria, ItemIngreso, Proveedor, Producto } from 'src/app/interfaces/interfaces';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Bodega } from '../../interfaces/interfaces';
import { formatoFecha } from 'src/app/utils/utils';



export const _filterProveedor = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};



@Component({
  selector: 'app-admin-ingresos',
  templateUrl: './admin-ingresos.component.html',
  styleUrls: ['./admin-ingresos.component.css']
})
export class AdminIngresosComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'descripcion', 'valor_unitario', 'cantidad', 'total'];


  dataSource: MatTableDataSource<any>;
  proveedores: Proveedor[];
  bodegas: Bodega[];
  productos: Producto[] = [];
  direccion: string = '';
  formatDate: string;
  productoSeleccionado: Producto;

  public formIngreso: FormGroup;
  public formAddItem: FormGroup;


  bodega_id = new FormControl();
  proveedor_id = new FormControl();
  myControlProveedor = new FormControl();



  filteredOptionsBodegas: Observable<Bodega[]>;
  filteredOptionsProveedor: Observable<Proveedor[]>;
  filteredOptionsProducto: Observable<Producto[]>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private productoService: ProductoService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.getProveedores();
    this.getBodegas();
    this.createformIngreso();
    this.createFormItem();


    this.dataSource = new MatTableDataSource(this.formIngreso.value.items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.formatDate = formatoFecha(new Date().toString());
  }

  /** CREATE FORMS */
  createformIngreso() {
    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formIngreso = this.fb.group({
      bodega_id: ['', Validators.required],
      observacion: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      fecha_ingreso: [new Date(), Validators.required],
      items: [[], Validators.minLength(1)]
    });

    this.formatDate = formatoFecha(this.formIngreso.get('fecha_ingreso').value)
    console.log(this.formIngreso.value);
  }

  createFormItem(): any {
    this.formAddItem = this.fb.group({
      producto_id: [''],
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      valor_unitario: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.nullValidator]],
      total: ['', [Validators.required]]
    });
    return this.formAddItem;
  }

  /** GETS */

  getProveedores() {
    this.productoService.getProveedores().subscribe(
      res => {
        console.log(res);
        this.proveedores = res.proveedores;

        this.filteredOptionsProveedor = this.formIngreso.get("proveedor_id").valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value?.nombre)),
          map(nombre => (nombre ? this._filterProveedor(nombre) : this.proveedores.slice())),
        );
      },
      error => {
        console.log(error)
      }
    )
  }

  getBodegas() {
    this.productoService.getBodegas().subscribe(
      res => {
        console.log(res);
        this.bodegas = res.bodegas;

        this.filteredOptionsBodegas = this.formIngreso.get("bodega_id").valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value?.nombre)),
          map(nombre => (nombre ? this._filterBodegas(nombre) : this.bodegas.slice())),
        );
      },
      error => {
        console.log(error)
      }
    )
  }

  /** AUTOCOMPLETE PROVEEDOR */

  displayFnProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.nombre ? proveedor.nombre : '';
  }

  private _filterProveedor(nombre: string): Proveedor[] {
    const filterValue = nombre.toLowerCase();

    return this.proveedores.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  /** AUTOCOMPLETE BODEGAS*/

  displayFnBodegas(bodega: Bodega): string {
    return bodega && bodega.nombre ? bodega.nombre : '';
  }

  private _filterBodegas(nombre: string): Bodega[] {
    const filterValue = nombre.toLowerCase();

    return this.bodegas.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  /** AUTOCOMPLETE PRODUCTO*/

  displayFnProducto(producto: Producto): string {
    return producto && producto.codigo ? producto.codigo : '';
  }

  productoSelectEvent(event: any) {
    console.log(event)

    this.productoSeleccionado = event;
    this.formAddItem.patchValue({
      descripcion: event.nombre,
      producto_id: event.id
    });
  }

  /** CREAR INGRESO */

  crearIngreso() {

    this.formIngreso.value.bodega_id = this.formIngreso.get('bodega_id').value._id;

    this.formIngreso.patchValue({
      items: this.formIngreso.value.items,
      proveedor_id: this.formIngreso.get('proveedor_id').value._id,
      bodega_id: this.formIngreso.get('bodega_id').value._id
    })


    this.productoService.createIngreso(this.formIngreso.value).subscribe(
      (res: any) => {

        if (res.ok) {

          setTimeout(() => {
            document.getElementById('clearIngresoBodega').click();
            this.formIngreso.patchValue({ items: [], fecha_ingreso: new Date() });
            this.formatDate = formatoFecha(this.formIngreso.get('fecha_ingreso').value)
          }, 100);

          this.userService.notificacion('Ingreso creado!', '', 'snackbar__success');

        } else {
          console.log(res.message);
          this.userService.notificacion('Error en ingreso!', '', 'snackbar__error');
        }
      },
      error => {
        console.log(error);
      });
  }


  buscarProducto(event: any) {

    if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 13) {
      return;
    }
    this.productoSeleccionado = null;

    this.productoService.getProducto(event.target.value).subscribe(
      (res: any) => {
        this.productos = res.productos;

      },
      (error: any) => {
        console.log(error);
      })
  }







  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }



  createReactiveIngreso() {
    this.productoService.createCategoria(this.formIngreso.value).subscribe(
      res => {
        if (res.ok == true) {
          console.log(res);
          this.userService.notificacion('Categoria creada!', '', 'snackbar__success');
          this.formIngreso.reset();
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  getErrorMessage(field: string) {
    let message;
    const campo = this.formIngreso.controls[field];

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    }

    return message;
  }



  /*** NUEVAS  */

  getTotalCost() {
    return this.formIngreso.value.items.map((t: { total: any; }) => t.total).reduce((acc: any, value: any) => acc + value, 0);
  }
  getTotalCantidad() {
    return this.formIngreso.value.items.map((t: { cantidad: any; }) => t.cantidad).reduce((acc: any, value: any) => acc + value, 0);
  }

  calcTotal() {
    this.formAddItem.patchValue({
      total: this.formAddItem.get('cantidad').value * this.formAddItem.get('valor_unitario').value
    });
  }

  addData() {

    console.log(this.formAddItem.value);
    this.formAddItem.value.producto_id = this.formAddItem.value.codigo._id;
    this.formAddItem.value.codigo = this.formAddItem.value.codigo.codigo;
    this.formIngreso.value.items = [...this.formIngreso.value.items, this.formAddItem.value];
    //this.formIngreso.value.items.push(this.formAddItem.value);
    //this.formAddItem.value.descripcion = this.formAddItem.value.codigo.descripcion;
    setTimeout(() => {
      document.getElementById('clearAddItem').click();
    }, 100);
    console.log(this.formIngreso.value.items);
    this.productos = [];
  }

  removeData() {
    //this.transactions = this.transactions.slice(0, -1);
  }

  proveedorEvent(event: any) {
    this.direccion = event.option.value.direccion;
  }


  isValidField(field: string) {
    console.log(this.formIngreso)
    const campo = this.formIngreso.controls[field];
    console.log(campo)
    return (campo.dirty && campo.invalid)
  }

}
