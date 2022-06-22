import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Proveedor } from 'src/app/interfaces/interfaces';
import { ProductoService } from 'src/app/services/producto.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-admin-proveedores',
  templateUrl: './admin-proveedores.component.html',
  styleUrls: ['./admin-proveedores.component.css']
})
export class AdminProveedoresComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'ruc', 'celular', 'direccion', 'email', 'estado', 'actions'];
  dataSource: MatTableDataSource<Proveedor>;
  proveedores: any;
  editActive = false;
  public formProveedor: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productoService: ProductoService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createformProveedor();
    this.getProveedores();
  }

  getProveedores() {
    this.productoService.getProveedores().subscribe(
      res => {
        this.proveedores = res.proveedores;

        this.dataSource = new MatTableDataSource(this.proveedores);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }


  clear() {
    this.formProveedor.reset();
    this.editActive = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isValidField(field: string) {
    const campo = this.formProveedor.get(field);
    return (
      (campo.touched || campo.dirty) && campo.invalid
    )
  }


  createformProveedor() {
    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formProveedor = this.fb.group({
      nombre: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', [Validators.required]],
      user_id: [''],
      _id: ['']
    });
  }

  createReactiveProveedor() {
    this.productoService.createProveedor(this.formProveedor.value).subscribe(
      res => {
        if (res.ok == true) {
          console.log(res);
          this.userService.notificacion('Proveedor creado!', '', 'snackbar__success');
          this.getProveedores();
          document.getElementById('btn-form-reset-proveedor').click();

        }
      },
      error => {
        console.log(error);
      }
    )
  }


  getErrorMessage(field: string) {
    let message;
    const campo = this.formProveedor.get(field);

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    }

    return message;
  }



  borrarProveedor(id: string) {
    this.productoService.deleteProveedor(id).subscribe(
      (res: any) => {

        if (res.ok) {
          this.getProveedores()
          this.userService.notificacion('Proveedor eliminado correctamente.', '', 'snackbar__success');
        } else {
          this.userService.notificacion(res.message, '', 'snackbar__warning');
        }

      },
      error => {
        this.userService.notificacion('Intente de nuevo.', '', 'snackbar__warning');
        console.log(error)
      }
    )
  }


  editarProducto() {

    this.productoService.editProveedor(this.formProveedor.value).subscribe(
      (res: any) => {

        if (res.ok) {
          this.userService.notificacion('Proveedor actualizado!', '', 'snackbar__success');
          this.getProveedores();
          document.getElementById('btn-form-reset-proveedor').click();
        } else {
          this.userService.notificacion(res.message, '', 'snackbar__warning');
        }

      },
      error => {
        console.log(error);
      }
    )


  }


  selectProducto(data: any) {
    console.log(data)
    this.editActive = true;
    this.formProveedor.setValue({
      _id: data._id,
      user_id: data.user_id,
      nombre: data.nombre,
      ruc: data.ruc,
      celular: data.celular,
      direccion: data.direccion,
      email: data.email,
      estado: data.estado
    })
  }

}
