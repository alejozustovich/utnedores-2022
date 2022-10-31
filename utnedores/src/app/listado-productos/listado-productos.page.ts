import { Component, OnInit } from '@angular/core';
import { AuthService, Producto } from '../services/auth.service';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';


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
  categoria = "";
  isModalOpen = false;
  isModalOpen2 = false;

  constructor(
    private authService: AuthService
  ) { 
    this.DesactivarSpinner();
    this.TraerProductos();
  }

  ngOnInit() { }

  VerMenu(){
    this.isModalOpen = false;
    this.isModalOpen2 = false;
  }

  TraerProductos() {
    this.authService.getProducts().subscribe(allProducts => {
      this.productos = allProducts;
      this.productos.forEach(u => {
          
          var foto1Buscar = "productos/" + u.foto1;
          var foto2Buscar = "productos/" + u.foto2;
          var foto3Buscar = "productos/" + u.foto3;
          const storage = getStorage();

          const storageRef1 = ref(storage, foto1Buscar);
          getDownloadURL(storageRef1).then((response) => {
            u.foto1 = response;
          });

          const storageRef2 = ref(storage, foto2Buscar);
          getDownloadURL(storageRef2).then((response) => {
            u.foto2 = response;
          });

          const storageRef3 = ref(storage, foto3Buscar);
          getDownloadURL(storageRef3).then((response) => {
            u.foto3 = response;
          });
      });
    });
  }

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
      this.cargando = false;
    }, 3000);
  }

  FiltrarCategoria(categoria) {
    this.isModalOpen = true;
    this.categoria = categoria;
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

  RealizarPedido() {
    this.isModalOpen2 = true;
  }

  Cancelar() {
    
  }

}
