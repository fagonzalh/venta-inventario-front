import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from 'src/app/interfaces/interfaces';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-admin-categorias',
  templateUrl: './admin-categorias.component.html',
  styleUrls: ['./admin-categorias.component.css']
})
export class AdminCategoriasComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'estado', 'actions'];
  dataSource: MatTableDataSource<Categoria>;
  categorias: any;
  editActive = false;
  public formCategoria: FormGroup;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private productoService: ProductoService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCategorias();
    this.createformCategoria();
  }

  getCategorias() {
    this.productoService.getCategorias().subscribe(
      res => {
        this.categorias = res.categorias;

        this.dataSource = new MatTableDataSource(this.categorias);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }

  clear() {
    this.formCategoria.reset();
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
    const campo = this.formCategoria.get(field);
    return (
      (campo.touched || campo.dirty) && campo.invalid
    )
  }


  createformCategoria() {
    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formCategoria = this.fb.group({
      nombre: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      _id: ['']
    });
  }

  createReactiveCategoria() {
    this.productoService.createCategoria(this.formCategoria.value).subscribe(
      res => {
        if (res.ok == true) {
          console.log(res);
          this.userService.notificacion('Categoria creada!', '', 'snackbar__success');
          this.getCategorias();
          this.formCategoria.reset();
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  getErrorMessage(field: string) {
    let message;
    const campo = this.formCategoria.get(field);

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    }

    return message;
  }


  borrarCategoria(id: string) {
    this.productoService.deleteCategoria(id).subscribe(
      res => {
        console.log(res)
        this.getCategorias()
        this.userService.notificacion('Categoria eliminada correctamente.', '', 'snackbar__success');
      },
      error => {
        this.userService.notificacion('Intente de nuevo.', '', 'snackbar__warning');
        console.log(error)
      }
    )
  }


  editarCategoria() {
    console.log(this.formCategoria.value)

    this.productoService.editCategoria(this.formCategoria.value).subscribe(
      res => {
        console.log(res);
        this.userService.notificacion('Categoria actualizada!', '', 'snackbar__success');
        this.getCategorias();
        this.formCategoria.reset();
        this.editActive = false;
      },
      error => {
        console.log(error);
      }
    )


  }


  selectCategoria(data: any) {
    console.log(data)
    this.editActive = true;
    this.formCategoria.setValue({ nombre: data.nombre, estado: data.estado, _id: data._id })
  }


}
