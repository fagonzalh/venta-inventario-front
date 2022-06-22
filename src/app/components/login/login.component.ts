import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // EXPRESION REGULAR QUE VALIDA QUE SEA EMAIL
  private isValidEmail = /\S+@\S+\.\S+/;

  //Controla visualizacion de la password
  hide = true;

  //Modelo de User Login
  user: User = {
    password: '',
    username: ''
  }


  /** VARIABLES PARA REACTIVE FORM */

  public formLogin: FormGroup;


  /** FIN VARIABLES PARA REACTIVE FORM */


  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    //CREAR FORMULARIO REACTIVO Y SUS CAMPOS
    this.formLogin = this.fb.group({
      //email: ['', [Validators.required, Validators.email]],     // Valida de igual forma el email
      email: ['admin@admin.com', [Validators.required, Validators.pattern(this.isValidEmail)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });


  }

  async login(user: NgForm) {

    if (user.invalid) return;

    const valid = await this.userService.login(user.value);

    if (valid) {
      this.router.navigate(['/home'])
      //window.location.href = "/home";
    } else {
      alert('Las contraseñas no son validas')
    }
  }



  async reactiveLogin() {

    if (this.formLogin.invalid) { return; }

    const valid = await this.userService.login(this.formLogin.value);

    if (valid) {
      this.router.navigate(['/venta'])
    } else {
      alert('Las contraseñas no son validas')
    }
  }

  getErrorMessage(field: string) {
    let message;
    const campo = this.formLogin.get(field);

    if (campo.errors.required) {
      message = 'El campo es obligatorio.'
    } else if (campo.hasError('pattern')) {
      message = 'El email no es válido.'
    } else if (campo.hasError('minlength')) {
      const minLength = campo.errors?.minlength.requiredLength;
      message = `De ingresar mínimo ${minLength} carácteres`
    }

    return message;
  }


  isValidField(field: string) {
    const campo = this.formLogin.get(field);
    return (
      (campo.touched || campo.dirty) && campo.invalid
    )
  }

}
