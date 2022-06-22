import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  panelOpenState = false;
  categorias: any;
  productos: any;
  productoArr: any[] = [];

  constructor(
    private productoSrv: ProductoService,
    private userSrv: UserService
  ) { }

  ngOnInit(): void {
    this.getCategorias();
    this.userSrv.loadJS();
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
        this.productos = res.producto;
        console.log(this.productos)
      },
      err => {
        console.log(err);
      }
    )
  }


  seleccionarCategoria(id: string, event: any) {

    let inputs = document.getElementsByTagName('mat-chip');
    const propertyValues = Object.values(inputs);

    propertyValues.map(item => {
      item.classList.remove('mat__chip__selected')
    })

    document.getElementById(id).classList.add('mat__chip__selected');
    this.getProductosByCategory(id)
  }


  addCart(prod: any) {

    const obj = prod;
    obj.cantidad = 1;
    obj.subtotal = prod.precio;
    //this.productoArr.push(prod);
    this.productoSrv.productos$.emit(obj);
  }


  test(e: any) {
    console.log(e)
  }

}
