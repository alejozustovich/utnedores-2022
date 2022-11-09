import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Pedido, Producto, Usuario } from '../services/auth.service';
import { UtilidadesService } from '../services/utilidades.service';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { PushNotificationService } from '../services/push-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-cocina',
  templateUrl: './home-cocina.page.html',
  styleUrls: ['./home-cocina.page.scss'],
})
export class HomeCocinaPage implements OnInit, OnDestroy {

  pedidosVisibles: Pedido[];
  pedidos: Pedido[];
  productos: Producto[];
  volumenOn = true;
  spinner = true;
  tipo = "";
  isModalOpen = false;
  isModalOpen2 = false;
  confirmarPedido = false;
  idFieldPedidoActual = "";
  indicePedidoActual = -1;
  hayPedido = false;
  numeroMesa = "0";
  confirmarButton = false;
  users: Usuario[];
  idFieldToken = "";

  estadoPedido: string[] = [
    "Pendientes",
    "Confirmados",
    "Entregados"];
  tipoPedido: string[] = [
    "Confirmado", 
    "Preparado",
    "Recibido"];
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

  subUsers: Subscription;
  subPedidos: Subscription;
  subProductos: Subscription;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService,
    private pnService: PushNotificationService
  ) { 
    this.Sonido();
    this.DesactivarSpinner();
    this.ObtenerTipo();
    this.TraerProductos();
    this.TraerUsuarios();
    setTimeout(()=>{
      this.TraerPedidos();
    },4500);
  }

  ngOnInit() { }

  ngOnDestroy(){	
    this.subUsers.unsubscribe();
    this.subProductos.unsubscribe();
    this.subPedidos.unsubscribe();
  }

  async Alerta(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 2500,
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  TraerUsuarios(){
    this.subUsers = this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
    });
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

  TraerPedidos(){
    	this.subPedidos = this.authService.traerPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;
      var pedidosSeleccionados = [];

      for(var i = 0 ; i < this.pedidos.length - 1; i++){
        for(var k = i + 1; k < this.pedidos.length ; k++){
          if((Number(this.pedidos[i].idPedido)) > (Number(this.pedidos[k].idPedido))){
            var pedidoAux = this.pedidos[i];
            this.pedidos[i] = this.pedidos[k];
            this.pedidos[k] = pedidoAux;
          }
        }
      }
      for(var i = 0 ; i < this.pedidos.length; i++){
        this.pedidos[i].hora = ((this.pedidos[i].hora).substring(0,((this.pedidos[i].hora).length - 3)));


        if(this.tipo.includes("Cocinero")){
          if(this.pedidos[i].listoCocinero === "0"){
            this.hayPedido = true;
            this.pedidos[i].estado = "Pendientes";
            pedidosSeleccionados.push(this.pedidos[i]);
          }
          if(this.pedidos[i].listoCocinero === "1"){
            this.hayPedido = true;
            this.pedidos[i].estado = "Confirmados";
            pedidosSeleccionados.push(this.pedidos[i]);
          }            
        }


        if(this.tipo.includes("Bartender")){
          if(this.pedidos[i].listoBartender === "0"){
            this.hayPedido = true;
            this.pedidos[i].estado = "Pendientes";
            pedidosSeleccionados.push(this.pedidos[i]);
          }
          if(this.pedidos[i].listoBartender === "1"){
            this.hayPedido = true;
            this.pedidos[i].estado = "Confirmados";
            pedidosSeleccionados.push(this.pedidos[i]);
          }            
        }
      }

      this.pedidosVisibles = pedidosSeleccionados;
    });
  }

  TraerProductos() {
    this.subProductos = this.authService.getProducts().subscribe(allProducts => {
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
    if(this.tipo.includes("Cocinero") || this.tipo.includes("Bartender")){
      this.router.navigateByUrl('/alta-producto', { replaceUrl: true });
    }else
    {
      this.spinner = false;
      this.ObtenerTipo();
      this.Alerta("Ocurrió un error! Reintentar", 'danger');
      if(this.volumenOn){
        this.utilidades.SonidoError();
      }
      this.utilidades.VibrarError();
    }
  }

  ConfirmarPedido(){
    this.confirmarPedido = true;
  }

  VerPedido(index: number, numMesa: string, idField: string){
    this.indicePedidoActual = index;
    this.confirmarButton = false;
    this.idFieldPedidoActual = idField;
    this.numeroMesa = numMesa;

    if(this.pedidosVisibles[index].estado.includes("Pendientes")){
      if(this.tipo.includes("Cocinero")){
        if(this.pedidosVisibles[index].listoCocinero.includes("0")){
          this.confirmarButton = true;
        }
      }
      if(this.tipo.includes("Bartender")){
        if(this.pedidosVisibles[index].listoBartender.includes("0")){
          this.confirmarButton = true;
        }
      }
    }

    for(var i = 0 ; i < 50; i++){
      this.cantProductosAgregados[i] = 0;
    }

    var pedidoAux = JSON.parse(this.pedidosVisibles[index].productos);
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

    var flag = true;
    var tokens = [""];

    this.users.forEach(user => {
      if(user.tipo.includes("Mozo")){
        if(user.token != ""){
          if(flag){
            flag = false;
            tokens[0] = user.token;
          }else{
            tokens.push(user.token);
          }
        }
      }
    });

    if(this.tipo.includes("Cocinero")){
      if(this.pedidos[this.indicePedidoActual].listoBartender.includes("0")){
        this.authService.listoCocinero(this.idFieldPedidoActual);
      }else{
        this.authService.pedidoPreparado(this.idFieldPedidoActual);
        setTimeout(() => {
          if(!flag){
            this.pnService.sendPush(tokens, "Pedido Listo", "Entregar Pedido");
          }
        }, 1500);
      }
    }
    if(this.tipo.includes("Bartender")){
      if(this.pedidos[this.indicePedidoActual].listoCocinero.includes("0")){
        this.authService.listoBartender(this.idFieldPedidoActual);
      }else{
        this.authService.pedidoPreparado(this.idFieldPedidoActual);
        setTimeout(() => {
          if(!flag){
            this.pnService.sendPush(tokens, "Pedido Listo", "Entregar Pedido");
          }
        }, 1500);
      }
    }

    if(this.volumenOn){
      this.utilidades.SonidoConfirmar();
    }
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
        this.idFieldToken = user.token;
        localStorage.setItem('tipoAlta', user.tipo);
      });
    },2500);
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
    this.authService.logout();
    setTimeout(()=>{
      this.pnService.eliminarToken(this.idFieldToken);
    },1000);
    setTimeout(()=>{
      this.SonidoEgreso();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    },2000);
  }

}
