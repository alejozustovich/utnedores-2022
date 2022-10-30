import { Component, OnInit } from '@angular/core';
import { AuthService, Producto } from '../services/auth.service';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'],
})
export class ListadoProductosPage implements OnInit {

  productos: Producto[];
  cargando = true;
  spinner = true;
  esBebida = true;
  esComida = true;
  cantidad = 0;
  confirmarPedido = false;
  precioTotal = 0;
  tiempoTotal = 0;

  constructor(
    private authService: AuthService
  ) { 
    this.DesactivarSpinner();
    this.TraerProductos();
  }

  ngOnInit() { }

  TraerProductos() {
    this.authService.getProducts().subscribe(allProducts => {
      this.productos = allProducts;
    });
  }

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
      this.cargando = false;
    }, 3000);
  }

  SumarProducto(precio) {
    this.cantidad++;
    let precioInt : number = +precio;
    this.precioTotal += precioInt;
  }

  RestarProducto(precio) {
    this.cantidad--;
    let precioInt : number = +precio;
    this.precioTotal -= precioInt;
  }

  ConfirmarPedido() {
    this.confirmarPedido = true;
  }

  Cancelar() {
    this.confirmarPedido = false;
  }

}
