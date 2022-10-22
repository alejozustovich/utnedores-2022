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

  selectedIndex = 0;
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
  prodPhoto = "../../assets/dessert-photo.png";
  srcProductPhoto: string[] = ["../../assets/dessert-photo.png", "../../assets/dessert-photo.png", "../../assets/dessert-photo.png"];
  
  producto = "";
  tam = "";
  descripcion = "";
  tiempoElaboracion = "";
  precio = "";
  fotosLleno = false;
  
  
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    this.Actualizar();
  }

  SetTamanio(value){
    this.tam = value;
  }

  SetDescripcion(value){
    this.descripcion = value;
  }


  SetProducto(value){
    this.producto = value;
  }

  SetElaboracion(value){
    this.tiempoElaboracion = value;
  }


  

  SelectChange(event){
    this.selectedIndex = Number(event.detail.value);
    if(this.selectedIndex == 4 || this.selectedIndex == 5){
      this.bebida = false;
      this.elab = true;
      (<HTMLInputElement>document.getElementById('elaboracion')).value = "";
      this.tiempoElaboracion = "0";
    }else{
      this.tam = "0";
      (<HTMLInputElement>document.getElementById('tamanio')).value = "";
      this.bebida = true;
      this.elab = false;
    }

  }

  SetPrecio(value){
    this.precio = value;
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
    (<HTMLInputElement>document.getElementById('inputFiles')).click();
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
    },4000);
  }

  ngOnInit() {
  }

  SubirImagenes(){
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

  LimpiarFoto(num: number){
    this.files[num] = null;
    this.srcProductPhoto[num] = this.prodPhoto;
    this.fotosLleno = false;
  }



  AsignarImagen(indice: number){
    var readerVar = new FileReader();
    readerVar.readAsDataURL(this.files[indice]);
    readerVar.onload = (_event) => {
      this.srcProductPhoto[indice] = (readerVar.result).toString();
    }
  }


  Cargar(event:any):void{
    
    var selectFile = event.target.files;
    var num = selectFile.length;
    var cant = 0;
    var indice = 0;

    for(var i = 0 ; i < this.srcProductPhoto.length ; i++)
    {
      if(this.srcProductPhoto[i].includes(this.prodPhoto)){
        cant = cant + 1;
      }
    }

    if(num <= cant){

      if(this.files[0] == null){
        this.files[0] = event.target.files[indice];
        this.AsignarImagen(0);
        indice = indice + 1;
      }

      if(this.files[1] == null && num >= (indice + 1)){
        this.files[1] = event.target.files[indice];
        this.AsignarImagen(1);
        indice = indice + 1;
      }

      if(this.files[2] == null && num >= (indice + 1)){
        this.files[2] = event.target.files[indice];
        this.AsignarImagen(2);
      }
      this.fotosLleno = true;

      setTimeout(()=>{
        for(var i = 0 ; i < 3 ; i++)
        {
          if(this.srcProductPhoto[i].includes(this.prodPhoto)){
            this.fotosLleno = false;
          }
        }
      },3000);
      
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

  AgregarProducto(){
    if(this.numProducto == "0"){
      //ERROR
      this.TraerProductos();
    }
    else{

      //AGREGAR FOTOS
      var unProducto: Producto = {
        idField: "",
        idProducto: this.numProducto,
        categoria: this.categorias[this.selectedIndex],
        producto: this.producto,
        tamanio: this.tam,
        descripcion: this.descripcion,
        tiempoElaboracion: this.tiempoElaboracion,
        foto1: this.nombreFotos[0],
        foto2: this.nombreFotos[1],
        foto3: this.nombreFotos[2],
        precio: this.precio,
        qr: this.myAngularxQrCode
      }
      this.SubirImagenes();
      this.authService.addProduct(unProducto);
    }
  }

  Volver(){
    this.router.navigateByUrl('alta-cliente');
  }
}
