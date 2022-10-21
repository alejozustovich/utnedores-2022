import { Component, OnInit } from '@angular/core';
import { AuthService, Producto } from '../services/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Auth,	signInWithEmailAndPassword,	createUserWithEmailAndPassword,	signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getStorage, ref } from "firebase/storage";
import { getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage implements OnInit {

  bebida = false;
  elab = false;
  spinner = false;
  productos: Producto[];
  numProducto = "0";
  mostrarQr = false;
  nombreFotos: string[] = ["", "", ""];
  files: File[] = [];
  categorias: string[] = [
    "Entradas",
    "Promociones",
    "Platos fríos",
    "Platos calientes",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Postres y Café-Te"];
  prodPhoto = "../../assets/product-photo.png";
  srcProductPhoto: string[] = ["../../assets/product-photo.png", "../../assets/product-photo.png", "../../assets/product-photo.png"];
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    this.Actualizar();
  }

  SetTamanio(value){

  }

  SetDescripcion(value){

  }


  SetProducto(value){

  }

  SetElaboracion(value){

  }


  SelectChange(){
    var index = Number((<HTMLInputElement>document.getElementById('categoria')).value);
    if(index == 4 || index == 5){
      this.bebida = false;
      this.elab = true;
      (<HTMLInputElement>document.getElementById('elaboracion')).value = "";
    }else{
      (<HTMLInputElement>document.getElementById('tamanio')).value = "";
      this.bebida = true;
      this.elab = false;
    }
    console.log(this.categorias[index]);
  }

  Actualizar(){
    this.TraerProductos();
    this.AsignarNombreFotos();
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  TraerProductos(){
		this.authService.getProducts().subscribe(allProducts => {
      this.productos = allProducts;
      this.AsignarNumeroProducto();
		});
	}

  Fotos(){
    (<HTMLInputElement>document.getElementById('files')).click();
  }

  AsignarNumeroProducto(){
    for(var i = 0 ; i < this.productos.length ; i++)
    {
      if(Number(this.numProducto) < Number(this.productos[i].idProducto))
      {
        this.numProducto = this.productos[i].idProducto;
      }
    }
    this.numProducto = (Number(this.numProducto) + 1).toString();
    this.myAngularxQrCode = "PRODUCTO" + this.numProducto;
    this.mostrarQr = true;
  }



  Caracteres(dato: string){
    var retorno = dato.toString();
    if(dato.length == 1){
      retorno = "0" + retorno;
    }
    return retorno;
  }


  AsignarNombreFotos(){
    var date = new Date();
    this.nombreFotos[0] = "productos/" + date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
    setTimeout(()=>{
      date = new Date();
      this.nombreFotos[1] = "productos/" + date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
    },2000);
    setTimeout(()=>{
      date = new Date();
      this.nombreFotos[2] = "productos/" + date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
      this.AgregarProducto();
    },4000);
  }

  ngOnInit() {
  }

  Subir(){
    this.authService.subirImagenFile(this.nombreFotos[0], this.files[0]);
    setTimeout(()=>{
      this.authService.subirImagenFile(this.nombreFotos[1], this.files[1]);
    },3000);
    setTimeout(()=>{
      this.authService.subirImagenFile(this.nombreFotos[2], this.files[2]);
    },6000);
  }

  ImprimirMensaje(mensaje){
    console.log(mensaje);
  }

  Cargar(event:any):void{
    
    var selectFile = event.target.files;
    var num = selectFile.length;
    var cant = 0;

    for(var i = 0 ; i < this.srcProductPhoto.length ; i++)
    {
      if(this.srcProductPhoto[i].includes(this.prodPhoto)){
        cant = cant + 1;
      }
    }

    if(num == cant){
      for(var i = 0 ; i < num ; i++)
      {
        this.files[i] = event.target.files[i];
      }
  
      if(this.srcProductPhoto[0].includes(this.prodPhoto)){
        var readerVar0 = new FileReader();
        readerVar0.readAsDataURL(this.files[0]);
        readerVar0.onload = (_event) => {
          this.srcProductPhoto[0] = (readerVar0.result).toString();
        }
      }


      if(this.srcProductPhoto[1].includes(this.prodPhoto)){
        var readerVar1 = new FileReader();
        readerVar1.readAsDataURL(this.files[1]);
        readerVar1.onload = (_event) => {
          this.srcProductPhoto[1] = (readerVar1.result).toString();
        }
      }


      if(this.srcProductPhoto[2].includes(this.prodPhoto)){
        var readerVar2 = new FileReader();
        readerVar2.readAsDataURL(this.files[2]);
        readerVar2.onload = (_event) => {
          this.srcProductPhoto[2] = (readerVar2.result).toString();
        }
      }

    }
    else{
      if(cant == 1)
      {
        this.ImprimirMensaje("Seleccionar 1 imagen");
      }else
      {
        this.ImprimirMensaje(("Seleccionar " + cant.toString() + " imágenes"));
      }
    }
  }

  LimpiarFoto(num: number){
    this.srcProductPhoto[num] = this.prodPhoto;
  }

  AgregarProducto(){

    if(this.numProducto == "0"){
      //ERROR
      this.TraerProductos();
    }
    else{
      var index = (<HTMLInputElement>document.getElementById('categoria')).value;

      var producto = "";
      var tamanio = "";
      var descripcion = "";
      var tiempoElaboracion = "";
      var precio = "";

      var unProducto: Producto = {
        idField: "",
        idProducto: this.numProducto,
        categoria: this.categorias[index],
        producto: "",
        tamanio: "",
        descripcion: "",
        tiempoElaboracion: "",
        foto1: this.nombreFotos[0],
        foto2: this.nombreFotos[1],
        foto3: this.nombreFotos[2],
        precio: "",
        qr: this.myAngularxQrCode
      }
      console.log(unProducto);

      
      /*this.authService.addProduct(unProducto);
      setTimeout(()=>{
        this.Actualizar();
      },4000);*/
    }
  }

  Volver(){
    this.router.navigateByUrl('alta-cliente');
  }
}
