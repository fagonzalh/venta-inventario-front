import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from 'src/app/interfaces/interfaces';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Producto, Proveedor } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';


@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'codigo', 'proveedor_id', 'categoria_id', 'precio', 'image', 'actions'];
  dataSource: MatTableDataSource<Producto>;
  categorias: any;
  productos: any;
  proveedores: Proveedor[] = [];
  editActive = false;
  formProducto: FormGroup;
  srcFotoBlank = '/assets/img/p-250.png';
  pathFoto = '';
  apiImgProducto = environment.apiImgProducto;

  imagenFile: File = null;


  patt = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  /** AUTOCOMPLETE */

  myControl = new FormControl();
  filteredOptions: Observable<Categoria[]>;
  filteredOptionsProveedores: Observable<Proveedor[]>;

  constructor(
    private productoService: ProductoService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategorias();
    this.getProveedores();
    this.getProductos();
    this.createformProducto();

    this.pathFoto = this.srcFotoBlank;
  }





  getCategorias() {
    this.productoService.getCategorias().subscribe(
      res => {
        this.categorias = res.categorias;


        // Autocomplete
        console.log(this.categorias);
        this.filteredOptions = this.formProducto.get('categoria_id').valueChanges.pipe(
          startWith(''),
          map(nombre => (nombre ? this._filter(nombre) : this.categorias.slice()))
        );

      },
      error => {
        console.log(error);
      }
    )

  }

  getProductos() {
    this.productoService.getProductos().subscribe(
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


  getProveedores() {
    this.productoService.getProveedores().subscribe(
      res => {
        console.log(res)
        this.proveedores = res.proveedores;

        this.filteredOptionsProveedores = this.formProducto.get('proveedor_id').valueChanges.pipe(
          startWith(''),
          map(nombre => (nombre ? this._filterProveedor(nombre) : this.proveedores.slice()))
        )
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

  isValidField(field: string) {
    const campo = this.formProducto.get(field);
    return (campo.dirty && campo.invalid)
  }

  createformProducto() {
    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      categoria_id: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      estado: ['', Validators.required],
      image: [null],
      precio: [null, [Validators.required, Validators.min(0)]],
      _id: ['']
    });
  }

  async createReactiveProducto() {

    let base: any;
    console.log(this.formProducto.value);
    this.formProducto.value.image = this.imagenFile;
    console.log(this.formProducto.value);

    if (typeof this.formProducto.value.categoria_id == 'object' && this.formProducto.value.categoria_id != null) {
      this.formProducto.value.categoria_id = this.formProducto.value.categoria_id._id;
    }


    console.log(this.formProducto.value);

    if (this.formProducto.valid) {

      if (this.formProducto.value.image !== null) {
        base = await this.toBase64(this.formProducto.value.image)
      }

      const form_data = new FormData();
      form_data.append('categoria_id', this.formProducto.value.categoria_id);
      form_data.append('codigo', this.formProducto.value.codigo);
      form_data.append('proveedor_id', this.formProducto.value.proveedor_id._id);
      form_data.append('nombre', this.formProducto.value.nombre.toUpperCase());
      form_data.append('img_name', this.formProducto.value.image?.name || 'default');
      form_data.append('image', base);
      form_data.append('estado', this.formProducto.value.estado);
      form_data.append('precio', this.formProducto.value.precio);
      form_data.append('_id', this.formProducto.value._id);


      this.productoService.createProducto(form_data).subscribe(
        res => {
          if (res.ok) {
            this.userService.notificacion("Producto Creado.", "", "snackbar__success");
            this.getProductos();
            this.clearForm();
          } else {
            this.userService.notificacion("Error al crear producto.", "", "snackbar__warning");
          }

        },
        error => {
          console.log(error);
        }
      )

    } else {
      this.userService.notificacion("Formulario Incompleto.", "", "snackbar__warning");
    }

  }



  borrarProducto(id: string) {
    let dialogClient = this.matDialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: { message: 'Desea eliminar el producto?' }
    });

    dialogClient.afterClosed().subscribe(res => {

      if (res) {
        this.productoService.deleteProducto(id).subscribe(
          res => {
            console.log(res)
            this.getProductos();
            this.userService.notificacion('Producto eliminado.', '', 'snackbar__success');
          },
          error => {
            this.userService.notificacion('Intente de nuevo.', '', 'snackbar__warning');
            console.log(error)
          }
        )
      }
    })
  }

  async editarProducto() {
    console.log(this.formProducto.value)

    this.formProducto.value.image = this.imagenFile;

    if (typeof this.formProducto.value.image != 'string') {
      let base = await this.toBase64(this.formProducto.value.image);
      this.formProducto.value.base = base;
      this.formProducto.value.img_name = this.formProducto.value.image.name;
    }

    console.log(this.formProducto.value);


    this.productoService.editProducto(this.formProducto.value).subscribe(
      res => {
        console.log(res);
        // if (!res.ok) {
        //   return this.userService.notificacion(res.message, '', 'snackbar__warning');
        // }


        this.userService.notificacion('Producto actualizado!', '', 'snackbar__success');
        this.getProductos();
        this.clearForm();
        this.editActive = false;
      },
      error => {
        console.log(error);
      }
    )


  }

  toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  selectProducto(data: any) {

    console.log(data);
    this.editActive = true;
    this.formProducto.value._id = data._id;
    this.formProducto.value.nombre = data.nombre;
    this.formProducto.value.codigo = data.codigo;
    this.formProducto.value.precio = data.precio;
    this.formProducto.value.categoria_id = data.categoria_id;
    this.formProducto.value.proveedor_id = data.proveedor_id;
    this.formProducto.value.estado = data.estado;
    this.formProducto.value.image = data.image;
    this.imagenFile = data.image;

    this.pathFoto = `${this.apiImgProducto}/${this.formProducto.value.image}`

    this.formProducto.patchValue({
      nombre: data.nombre,
      _id: data._id,
      precio: data.precio,
      codigo: data.codigo,
      categoria_id: data.categoria_id,
      proveedor_id: data.proveedor_id,
      estado: data.estado,
      //image: data.image,
    })
  }

  handleFileInput(event: any) {
    let file = event.target.files[0];
    this.imagenFile = file;
    var output: any = document.getElementById('output');
    output.src = URL.createObjectURL(file);
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }
  }


  /** CATEGORIAS */
  displayFn(categoria: Categoria): string {
    return categoria && categoria.nombre ? categoria.nombre : '';
  }

  private _filter(nombre: string): Categoria[] {
    return this.categorias.filter((option: { nombre: string; }) => option.nombre.toLowerCase().includes(nombre));
  }
  /** FIN CATEGORIAS */

  /** PROVEEDOR */
  displayFnProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.nombre ? proveedor.nombre : '';
  }

  private _filterProveedor(nombre: string): Proveedor[] {
    return this.proveedores.filter((option) => option.nombre.toLowerCase().includes(nombre));
  }
  /** FIN CATEGORIAS */


  clearForm() {
    this.formProducto.reset();
    var output: any = document.getElementById('output');
    output.src = this.srcFotoBlank;
    document.getElementById('resetInputProducto').click();
    this.editActive = false;
    this.pathFoto = this.srcFotoBlank;
    this.imagenFile = null;
    console.log(this.formProducto.value);
  }

  getErrorMessage(field: string) {
    let message;
    const campo = this.formProducto.get(field);

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    }

    return message;
  }

  convertDecimal(e?: any) {
    e.preventDefault();
    let deci = Number(e.target.value).toFixed(2);
    this.formProducto.patchValue({
      precio: deci
    }, { onlySelf: false });
    console.log(this.formProducto.value);
  }

  upperCaseConvert(e: any) {
    return e.target.value.toUpperCase();
  }
}