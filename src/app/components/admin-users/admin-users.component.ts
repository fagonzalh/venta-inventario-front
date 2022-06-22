import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from 'src/app/interfaces/interfaces';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Producto } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';



@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  displayedColumns: string[] = ['username', 'email', 'role', 'avatar', 'actions'];
  dataSource: MatTableDataSource<Producto>;
  usuarios: any;
  productos: any;
  editActive = false;
  formUsuario: FormGroup;
  srcFotoBlank = '/assets/img/p-250.png';
  pathFoto = '';
  apiImgUser = environment.apiImgUsuario;
  hide = true;
  imagenFile: any = null;

  // EXPRESION REGULAR QUE VALIDA QUE SEA EMAIL
  private isValidEmail = /\S+@\S+\.\S+/;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  /** AUTOCOMPLETE */

  myControl = new FormControl();
  filteredOptions: Observable<Categoria[]>;

  constructor(
    private productoService: ProductoService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    //this.userService.loadJS();
    this.getUsuarios();
    this.createformUsuario();

    this.pathFoto = this.srcFotoBlank;
  }


  createformUsuario() {
    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formUsuario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
      role: ['', Validators.required],
      avatar: [null, Validators.required],
      _id: ['']
    });
  }


  getUsuarios() {
    this.userService.getUsers().subscribe(
      res => {
        this.usuarios = res;

        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error)
      }
    )
  }





  async createReactiveUser() {

    this.formUsuario.value.avatar = this.imagenFile;

    if (this.formUsuario.valid) {

      let base: any = await this.toBase64(this.formUsuario.value.avatar)

      this.formUsuario.value.img_name = this.formUsuario.value.avatar.name;
      this.formUsuario.value.avatar = base;

      this.userService.createUser(this.formUsuario.value).subscribe(
        res => {
          console.log(res)
          this.userService.notificacion("Usuario Creado.", "", "snackbar__success")
          this.getUsuarios();
          this.clearForm();
        },
        error => {
          console.log('entra error');
          console.log(error);
        }
      )

    } else {
      this.userService.notificacion("Formulario Incompleto.", "", "snackbar__warning");
    }

  }



  borrarUsuario(id: string) {

    let dialogClient = this.matDialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: { message: 'Desea eliminar este usuario?' }
    });

    dialogClient.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.userService.deleteUser(id).subscribe(
          res => {
            console.log(res)
            this.userService.notificacion('Producto eliminado.', '', 'snackbar__success');
            this.getUsuarios();
          },
          error => {
            this.userService.notificacion('Intente de nuevo.', '', 'snackbar__warning');
            console.log(error)
          }
        )
      }
    });
  }

  async editarUsuario() {

    this.formUsuario.value.avatar = this.imagenFile;

    if (typeof this.formUsuario.value.avatar != 'string') {
      let base = await this.toBase64(this.formUsuario.value.avatar);
      this.formUsuario.value.base = base;
      this.formUsuario.value.img_name = this.formUsuario.value.avatar.name;
    }

    console.log(this.formUsuario.value);

    this.userService.updateUser(this.formUsuario.value).subscribe(
      res => {

        if (!res.ok) {
          return this.userService.notificacion(res.message, '', 'snackbar__warning');
        }

        this.userService.notificacion('Usuario actualizado!', '', 'snackbar__success');
        this.getUsuarios();
        this.clearForm();
        this.editActive = false;
      },
      error => {
        console.log(error);
      }
    )


  }


  selectUsuario(data: any) {

    this.editActive = true;

    this.formUsuario.value._id = data._id;
    this.formUsuario.value.username = data.username;
    this.formUsuario.value.password = data.password;
    this.formUsuario.value.email = data.email;
    this.formUsuario.value.role = data.role;
    this.formUsuario.value.avatar = data.avatar;
    this.imagenFile = data.avatar;

    this.pathFoto = `${this.apiImgUser}/${this.formUsuario.value.avatar}`

    this.formUsuario.patchValue({
      _id: data._id,
      username: data.username,
      password: data.password,
      email: data.email,
      role: data.role,
      avatar: data.avatar
    })
  }


  toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  handleFileInput(event: any) {
    let file = event.target.files[0];
    this.imagenFile = file;
    var output: any = document.getElementById('imagenUser');
    output.src = URL.createObjectURL(file);

  }


  clearForm() {
    this.editActive = false;
    this.pathFoto = this.srcFotoBlank;
    var output: any = document.getElementById('imagenUser');
    output.src = this.srcFotoBlank;
    document.getElementById('resetInputUser').click();
  }

  getErrorMessage(field: string) {
    let message;
    const campo = this.formUsuario.get(field);

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    }

    return message;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isValidField(field: string) {
    const campo = this.formUsuario.get(field);
    return (campo.dirty && campo.invalid)
  }


  test() {
    console.log(this.formUsuario.value);
  }

}
