import { Component, OnInit } from '@angular/core';
import { AuthService, Producto, Pedido } from '../services/auth.service';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

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
  precioTotal = 0;
  tiempoTotal = 0;
  categoria = "";
  isModalOpen = false;
  isModalOpen2 = false;
  buttonsArray = [true, true, true, true, true, true, true];
  categorias: string[] = [
    "Entradas",
    "Promociones",
    "Platos fríos",
    "Platos calientes",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Postres y Café-Te"];
  cantidadPorCategoria = [0, 0, 0, 0, 0, 0, 0];
  productosAgregados = [];
  pedidoValido = false;
  numMesa = "";
  pedidoEnviado = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { 
    for(var i = 0 ; i < 50; i++){
      this.productosAgregados.push({tiempo: 0, cantidad: 0, precio: 0, categoria: ""});
    }
    this.numMesa = localStorage.getItem('numeroMesa');
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

      for(var i = 0 ; i < this.productos.length - 1; i++){
        for(var k = i + 1; k < this.productos.length ; k++){
          if((this.productos[i].producto).localeCompare(this.productos[k].producto) == 1){
            var userA = this.productos[i];
            this.productos[i] = this.productos[k];
            this.productos[k] = userA;
          }
        }
      }

      for(var i = 0 ; i < this.productos.length; i++){
        this.productosAgregados[Number(this.productos[i].idProducto)].tiempo = Number(this.productos[i].tiempoElaboracion);
        this.productosAgregados[Number(this.productos[i].idProducto)].precio = Number(this.productos[i].precio);
        this.productosAgregados[Number(this.productos[i].idProducto)].categoria = this.productos[i].categoria;
        for(var k = 0; k < this.categorias.length ; k++){
          if(this.productos[i].categoria.includes(this.categorias[k])){
            this.buttonsArray[k] = false;
            k = this.categorias.length;
          }
        }
      }
    });
  }

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
      this.cargando = false;
    }, 6000);
  }

  FiltrarCategoria(categoria) {
    this.isModalOpen = true;
    this.categoria = categoria;
    this.categoria == 'Bebidas sin alcohol' || this.categoria == 'Bebidas con alcohol'? this.esBebida = true : this.esBebida = false;
  }

  SumarProducto(idProducto: string) {
    this.productosAgregados[Number(idProducto)].cantidad = this.productosAgregados[Number(idProducto)].cantidad + 1;
    this.CalcularPrecio();
    this.CalcularTiempo();
    this.CantidadPorCategoria();
  }

  RestarProducto(idProducto: string) {
    if(this.productosAgregados[Number(idProducto)].cantidad > 0){
      this.productosAgregados[Number(idProducto)].cantidad = this.productosAgregados[Number(idProducto)].cantidad - 1;
    }
    this.CalcularPrecio();
    this.CalcularTiempo();
    this.CantidadPorCategoria();
  }

  CalcularPrecio(){
    var precio = 0;
    this.pedidoValido = false;
    this.productosAgregados.forEach(element => {
      if(element.cantidad > 0){
        this.pedidoValido = true;
        precio = precio + (element.precio * element.cantidad);
      }
    });
    this.precioTotal = precio;
  }

  CalcularTiempo(){
    var tiempoMayor = 0;
    this.productosAgregados.forEach(element => {
      if(element.cantidad > 0 && element.tiempo > tiempoMayor){
        tiempoMayor = element.tiempo;
      }
    });
    this.tiempoTotal = tiempoMayor;
  }

  CantidadPorCategoria(){
    for(var i = 0 ; i < this.categorias.length ; i++){
      this.cantidadPorCategoria[i] = 0;
    }
    this.productosAgregados.forEach(element => {
      if(element.cantidad > 0){
        for(var i = 0 ; i < this.categorias.length ; i++){
          if(this.categorias[i].includes(element.categoria)){
            this.cantidadPorCategoria[i] = this.cantidadPorCategoria[i] + element.cantidad;
          }
        }
      }
    });
  }

  RealizarPedido() {
    this.isModalOpen2 = true;
  }

  Caracteres(dato: string) {
    var retorno = dato.toString();
    if (dato.length == 1) {
      retorno = "0" + retorno;
    }
    return retorno;
  }

  Confirmar(){
    this.spinner = true;
    this.isModalOpen2 = false;
    this.DesactivarSpinner();

    var date = new Date();
    var fechaActual = this.Caracteres(date.getDate().toString()) + "/" + this.Caracteres(date.getMonth().toString()) + "/" + date.getFullYear().toString();
    var horaActual = this.Caracteres(date.getHours().toString()) + ":" + this.Caracteres(date.getMinutes().toString()) + ":" + this.Caracteres(date.getSeconds().toString());
    var flag = true;
    
    var productosPedido = "[";

    for(var i = 0 ; i < this.productos.length; i++){
      var index = Number(this.productos[i].idProducto);
      if(this.productosAgregados[index].cantidad > 0){

        if(flag){
          flag = false;
          productosPedido = productosPedido + '{"idProducto":"' + index.toString() + '", "cantidad":"' + (this.productosAgregados[index].cantidad).toString() + '"}';
        }else{
          productosPedido = productosPedido + ',{"idProducto":"' + index.toString() + '", "cantidad":"' + (this.productosAgregados[index].cantidad).toString() + '"}';
        }
      }
    }

    productosPedido = productosPedido + "]";
    
    var unPedido: Pedido = {idField: "",
    numMesa: this.numMesa,
    productos: productosPedido,
    fecha: fechaActual,
    hora: horaActual,
    estado: "Enviado"};

    this.authService.agregarPedido(unPedido);
    this.spinner = false;
    this.pedidoEnviado = true;
    setTimeout(() => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, 3000);
    //PUSH NOTIFICATION MOZO*/
  }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
