import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Categoria } from 'src/app/interfaces/interfaces';
import { ProductoService } from 'src/app/services/producto.service';


export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};




@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit {

  categorias: Categoria[];


  formProduct: FormGroup = this._formBuilder.group({
    categoria_id: ['', Validators.required]
  });

  filteredOptions: Observable<Categoria[]>;

  constructor(private _formBuilder: FormBuilder,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.getCategorias();
  }




  displayFn(categoria: Categoria): string {
    return categoria && categoria.nombre ? categoria.nombre : '';
  }


  private _filter(nombre: string): Categoria[] {
    const filterValue = nombre.toLowerCase();

    return this.categorias.filter((option) => option.nombre.toLowerCase().includes(filterValue));
  }


  getCategorias() {
    this.productoService.getCategorias().subscribe(
      res => {
        this.categorias = res.categorias;


        // Autocomplete
        console.log(this.categorias);
        this.filteredOptions = this.formProduct.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.nombre)),
          map(nombre => (nombre ? this._filter(nombre) : this.categorias.slice()))
        );

      },
      error => {
        console.log(error);
      }
    )

  }


  test(e: any) {
    console.log(e);
  }

  selectOpt(e: any) {

  }

}

