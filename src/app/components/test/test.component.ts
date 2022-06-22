import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  panelOpenState = false;
  categorias: any;
  productos: any;
  productoArr: any[] = [];

  test = false
  constructor(
    private productoSrv: ProductoService

  ) { }

  ngOnInit(): void {
    this.getCategorias()
  }


  getCategorias() {
    this.productoSrv.getCategorias().subscribe(
      res => {
        this.categorias = res['categorias'];
        this.getProductosByCategory(this.categorias[0]._id);
      },
      err => {
        console.log(err);
      }
    )
  }


  getProductosByCategory(idCat: any) {
    this.productoSrv.getProductosByCategoria(idCat).subscribe(
      res => {
        this.productos = res['productos'];
        console.log(this.productos)
      },
      err => {
        console.log(err);
      }
    )
  }


  seleccionarCategoria(id: string) {
    this.getProductosByCategory(id)
  }


  addCart(prod: any) {

    const obj = prod;
    obj.cantidad = 1;
    obj.subtotal = prod.precio;
    //this.productoArr.push(prod);
    this.productoSrv.productos$.emit(obj);
  }



}
