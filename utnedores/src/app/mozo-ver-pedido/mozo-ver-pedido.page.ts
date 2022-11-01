import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Pedido, Producto } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mozo-ver-pedido',
  templateUrl: './mozo-ver-pedido.page.html',
  styleUrls: ['./mozo-ver-pedido.page.scss'],
})
export class MozoVerPedidoPage implements OnInit {

  productos: Producto[];
  productosAgregados = [];
  pedidos: Pedido[];
  volumenOn = true;
  spinner = true;
  isModalOpen = true;
  pedidoConfirmado = false;
  pedidoNum = "0";
  numeroMesa = "0";

  categorias: string[] = [
    "Entradas",
    "Promociones",
    "Platos fríos",
    "Platos calientes",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Postres y Café-Te"];
  aprobarCategoria = [0, 0, 0, 0, 0, 0, 0];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 

    for(var i = 0 ; i < 50; i++){
      this.productosAgregados.push(0);
    }
    this.DesactivarSpinner();
    this.Sonido();
    this.TraerPedidos();
    this.TraerProductos();
  }

  VerPedido(index: number, numMesa: string){
    this.pedidoNum = (index + 1).toString();
    this.numeroMesa = numMesa;

    for(var i = 0 ; i < 50; i++){
      this.productosAgregados[i] = 0;
    }

    for(var i = 0 ; i < this.categorias.length ; i++){
      this.aprobarCategoria[i] = 0;
    }

    var objProductos = JSON.parse(this.pedidos[index].productos);

    for(var i = 0 ; i< objProductos.length; i++){

      var categoriaProducto = "";
      for(var k = 0 ; k < this.productos.length ; k++){

        if((Number(this.productos[k].idProducto)) == (Number(objProductos[i].idProducto))){
          categoriaProducto = this.productos[k].categoria;
          k = this.productos.length;
        }

      }
      this.productosAgregados[(Number(objProductos[i].idProducto))] = Number(objProductos[i].cantidad);

      for(var k = 0 ; k < this.categorias.length ; k++){
        if(this.categorias[k].includes(categoriaProducto)){
          this.aprobarCategoria[k] = 1;
        }
      }
    }
    console.log(this.productosAgregados);
    this.isModalOpen = true;
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

  ngOnInit() {
  }

  DesactivarSpinner(){
    setTimeout(() => {
      this.spinner = false;
    }, 7000);
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
    });
  }

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

  VerMenu(){
    //VERIFICAR SI HAY CAMBIOS
      //VENTANA CANCELAR CAMBIOS E IR AL MENU
        //CANCELAR    //ACEPTAR
  }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home-mozo', { replaceUrl: true });
  }

  RechazarPedido(){
    this.VerPedido(0, "3");
  }

}
