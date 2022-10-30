import { Component, OnInit } from '@angular/core';
import { AuthService, Producto } from '../services/auth.service';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'],
})
export class ListadoProductosPage implements OnInit {

  productos: Producto[];
  productosSeleccionados: Producto[];
  cargando = true;
  spinner = true;
  esBebida = true;
  confirmarPedido = false;
  cantidad = 0;
  precioTotal = 0;
  tiempoTotal = 0;
  categoria = "Entradas";


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

  FiltrarCategoria(categoria) {
    this.categoria = categoria;
    console.log(this.categoria);
    this.categoria == 'Bebidas sin alcohol' || this.categoria == 'Bebidas con alcohol'? this.esBebida = true : this.esBebida = false;
  }

  SumarProducto(precio, tiempo) {
    //this.productosSeleccionados.push(producto);
    this.cantidad++;
    let precioInt : number = +precio;
    let tiempoInt : number = +tiempo;
    this.precioTotal += precioInt;
    this.tiempoTotal += tiempoInt;
  }

  RestarProducto(precio, tiempo) {
    this.cantidad--;
    let precioInt : number = +precio;
    let tiempoInt : number = +tiempo;
    this.precioTotal -= precioInt;
    this.tiempoTotal -= tiempoInt;
  }

  ConfirmarPedido() {
    this.confirmarPedido = true;
  }

  Cancelar() {
    this.confirmarPedido = false;
  }

}
