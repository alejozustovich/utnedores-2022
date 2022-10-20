import { Component, OnInit } from '@angular/core';
import { AuthService, Producto } from '../services/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Auth,	signInWithEmailAndPassword,	createUserWithEmailAndPassword,	signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteObject, listAll, getDownloadURL, uploadString } from '@angular/fire/storage';


@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage implements OnInit {

  productos: Producto[];
  numProducto = "0";
  mostrarQr = false;
  foto1 = "";
  foto2 = "";
  foto3 = "";
  files: File[] = [];
  variable1: any = '';
  variable2: any = '';
  variable3: any = '';
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    private authService: AuthService
  ) { 

    this.Actualizar();
  }


  BuscarUrl(){
    var urlFoto = "";
    var imagenABuscar = "productos/nombreImagen";
    const storage = getStorage();
    const storageRef = ref(storage, imagenABuscar);
		getDownloadURL(storageRef).then((response) => {
      urlFoto = response;
		});
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

  AsignarNombreFotos(){
    var date = new Date();
    this.foto1 = "productos/" + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    setTimeout(()=>{
      date = new Date();
      this.foto2 = "productos/" + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    },2000);
    setTimeout(()=>{
      date = new Date();
      this.foto3 = "productos/" + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    
      this.AgregarProducto();
    },4000);
  }

  ngOnInit() {
  }

  Subir(){
    /*this.authService.subirImagenFile(this.foto1, this.files[0]);
    setTimeout(()=>{
      this.authService.subirImagenFile(this.foto2, this.files[1]);
    },3000);
    setTimeout(()=>{
      this.authService.subirImagenFile(this.foto3, this.files[2]);
    },6000);*/
  }

  Cargar(event:any):void{
    
    var selectFile = event.target.files;
    var num = selectFile.length;

    for(var i = 0 ; i < num ; i++)
    {
      this.files[i] = event.target.files[i];
    }

    if(num > 0)
    {
      var readerVar0 = new FileReader();
      readerVar0.readAsDataURL(this.files[0]);
      readerVar0.onload = (_event) => {
        this.variable1 = readerVar0.result;
      }
    }

    if(num > 1)
    {
      var readerVar1 = new FileReader();
      readerVar1.readAsDataURL(this.files[1]);
      readerVar1.onload = (_event) => {
        this.variable2 = readerVar1.result;
      }
    }
    if(num > 2)
    {
      var readerVar2 = new FileReader();
      readerVar2.readAsDataURL(this.files[2]);
      readerVar2.onload = (_event) => {
        this.variable3 = readerVar2.result;
      }
    }


  }



  AgregarProducto(){


    if(this.numProducto == "0"){
      //ERROR
      this.TraerProductos();
    }
    else{


      var categoria = "";
        var tamanio = "";
      var producto = "";
      var descripcion = "";
      var tiempoElaboracion = "";
      var precio = "";
      //CATEGORIA
        //TAMANIO
      //PRODUCTO
      //DESCRIPCION
      //TIEMPO ELABORACION
      //FOTO1
      //FOTO2
      //FOTO3
      //PRECIO

      var unProducto: Producto = {
        idField: "",
        idProducto: this.numProducto,
        categoria: "",
        producto: "",
        tamanio: "",
        descripcion: "",
        tiempoElaboracion: "",
        foto1: this.foto1,
        foto2: this.foto2,
        foto3: this.foto3,
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


}
