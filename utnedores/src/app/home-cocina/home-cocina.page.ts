import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Pedido, Producto } from '../services/auth.service';
import { UtilidadesService } from '../services/utilidades.service';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-home-cocina',
  templateUrl: './home-cocina.page.html',
  styleUrls: ['./home-cocina.page.scss'],
})
export class HomeCocinaPage implements OnInit {

  pedidos: Pedido[];
  productos: Producto[];
  volumenOn = true;
  spinner = true;
  tipo = "";
  isModalOpen = false;
  isModalOpen2 = false;
  confirmarPedido = false;
  idFieldPedidoActual = "";
  hayPedido = false;
  numeroMesa = "0";
  confirmarButton = false;

  estadoPedido: string[] = [
    "Pendientes",
    "Confirmados",
    "Entregados"];
  tipoPedido: string[] = [
    "Confirmado", 
    "Preparado",
    "Entregado"];
  cantTipoPedido = [];
  cantProductosAgregados = [];
  cantidadPorCategoria = [];
  categorias: string[] = [
    "Entradas",
    "Promociones",
    "Platos fríos",
    "Platos calientes",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Postres y Café-Te"];

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService
  ) { 
    for(var i = 0 ; i < 3; i++){
      this.cantTipoPedido.push(0);
    }
    this.Sonido();
    this.DesactivarSpinner();
    this.ObtenerTipo();
    setTimeout(()=>{
      this.TraerProductos();
      this.TraerPedidos();
    },4500);
  }

  ngOnInit() { }

  TraerPedidos(){
    this.authService.traerPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;

      for(var i = 0 ; i < this.pedidos.length - 1; i++){
        for(var k = i + 1; k < this.pedidos.length ; k++){
          if((Number(this.pedidos[i].idPedido)) > (Number(this.pedidos[k].idPedido))){
            var pedidoAux = this.pedidos[i];
            this.pedidos[i] = this.pedidos[k];
            this.pedidos[k] = pedidoAux;
          }
        }
      }
      for(var u = 0 ; u < this.tipoPedido.length ; u++){
        this.cantTipoPedido[u] = 0;
      }
      for(var i = 0 ; i < this.pedidos.length; i++){
        this.pedidos[i].hora = ((this.pedidos[i].hora).substring(0,((this.pedidos[i].hora).length - 3)));
        
        if(this.pedidos[i].estado.includes("Confirmado")){
          if(this.tipo.includes("Cocinero")){
            if(this.pedidos[i].listoCocinero.includes("0")){
              this.cantTipoPedido[0] = 1;
            }else{
              this.cantTipoPedido[1] = 1;
            }
          }
          if(this.tipo.includes("Bartender")){
            if(this.pedidos[i].listoBartender.includes("0")){
              this.cantTipoPedido[0] = 1;
            }else{
              this.cantTipoPedido[1] = 1;
            }
          }
        }

        if(this.pedidos[i].estado.includes("Preparado")){
          this.cantTipoPedido[1] = 1;
        }
        if(this.pedidos[i].estado.includes("Entregado")){
          this.cantTipoPedido[2] = 1;
        }

      }
      if(this.pedidos.length > 0){
        this.hayPedido = true;
      }
    });
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
            var prodAux = this.productos[i];
            this.productos[i] = this.productos[k];
            this.productos[k] = prodAux;
          }
        }
      }

      setTimeout(() => {
        this.spinner = false;
      }, 1500);
    });
  }

  IrAltaMesa(){
    this.spinner = true;
    this.router.navigateByUrl('/alta-producto', { replaceUrl: true });
  }

  ConfirmarPedido(){
    this.confirmarPedido = true;
  }

  VerPedido(index: number, numMesa: string, idField: string){
    this.confirmarButton = false;
    this.idFieldPedidoActual = idField;
    this.numeroMesa = numMesa;

    if(this.pedidos[index].estado.includes("Confirmado")){
      if(this.tipo.includes("Cocinero")){
        if(this.pedidos[index].listoCocinero.includes("0")){
          this.confirmarButton = true;
        }
      }
      if(this.tipo.includes("Bartender")){
        if(this.pedidos[index].listoBartender.includes("0")){
          this.confirmarButton = true;
        }
      }
    }

    for(var i = 0 ; i < 50; i++){
      this.cantProductosAgregados[i] = 0;
    }

    var pedidoAux = JSON.parse(this.pedidos[index].productos);
    for(var i = 0 ; i< pedidoAux.length; i++){
      
      for(var k = 0 ; k < this.productos.length ; k++){
        if((Number(this.productos[k].idProducto)) == (Number(pedidoAux[i].idProducto))){
          this.cantProductosAgregados[k] = (Number(pedidoAux[i].cantidad))
          k = this.productos.length;
        }
      }
    }
    this.CantidadPorCategoria();
    this.isModalOpen2 = true;
  }

  CantidadPorCategoria(){
    
    for(var i = 0 ; i < this.categorias.length ; i++){
      this.cantidadPorCategoria[i] = 0;
    }

    for(var i = 0 ; i < this.cantProductosAgregados.length ; i++){
      if(this.cantProductosAgregados[i] > 0){
        for(var k = 0 ; k < this.categorias.length ; k++){
          if(this.categorias[k].includes(this.productos[i].categoria)){

            if(this.tipo.includes("Cocinero")){
              if(k < 4){
                this.cantidadPorCategoria[k] = this.cantidadPorCategoria[k] + this.cantProductosAgregados[i];
              }
            }
            if(this.tipo.includes("Bartender")){
              if(k > 3){
                this.cantidadPorCategoria[k] = this.cantidadPorCategoria[k] + this.cantProductosAgregados[i];
              }
            }
          }
        }
      }
    }
  }

  AceptarConfirmarPedido(){
//COCINERO
  //SI   listoBartender == "0"   =>   listoCocinero = 1
  //SI   listoBartender == "1"   =>   listoCocinero = 1   &&    estado = "Preparado"

//BARTENDER
  //SI   listoCocinero == "0"   =>   listoBartender = 1
  //SI   listoCocinero == "1"   =>   listoBartender = 1   &&    estado = "Preparado"
  

    this.isModalOpen2 = false;
    this.confirmarPedido = false;
  }

  CancelarConfirmarPedido(){
    this.confirmarPedido = false;
  }

  AbrirPedidos(){
    this.isModalOpen = true;
    this.isModalOpen2 = false;
  }

  VolverHome(){
    this.isModalOpen = false;
  }

  VerPedidos(){
    this.isModalOpen = true;
  }

  DesactivarSpinner(){
    setTimeout(()=>{
      this.spinner = false;
    },7000);
  }

  ObtenerTipo(){
    setTimeout(()=>{
      this.authService.getUser(this.authService.usuarioActual()).then(user => {
        this.tipo = user.tipo;
      });
    },2500);
  }

  Sonido(){
    try {
      var sonido = localStorage.getItem('sonido');
      if(sonido != null){
        if(sonido.includes("No")){
          this.volumenOn = false;
        }
      }
    } catch (error) {
      
    }
  }

  ActivarDesactivarSonido() {
    if(this.volumenOn) {
      this.volumenOn = false;
      localStorage.setItem('sonido', "No");
    } else {
      this.volumenOn = true;
      localStorage.setItem('sonido', "Si");
    }
  }

  SonidoEgreso(){
    if(this.volumenOn) {
      this.utilidades.PlayLogout();
    }
    localStorage.clear();
  }

  CerrarSesion(){
    this.spinner = true;
    this.SonidoEgreso();
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
