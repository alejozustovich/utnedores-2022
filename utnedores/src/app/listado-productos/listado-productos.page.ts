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
  esBebida = false;
  cantidad = 0;
  confirmarPedido = false;

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

  SumarProducto() {
    this.cantidad++;
  }

  RestarProducto() {
    this.cantidad--;
  }

}
