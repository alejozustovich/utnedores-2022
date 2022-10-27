import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Mesa, Usuario, Espera } from '../services/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Console } from 'console';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit, AfterViewInit, OnDestroy {

  result = null;
  scanActive = false;
  users: Usuario[];
  mesas: Mesa[];
  listaEspera: Espera[];

  volumenOn = true;
  esRegistrado = true;
  spinner = true;
  qrLocal = "LOCALUTNEDORES";
  usuarioLogueado: Usuario = {
    idField: "0",
    idUsuario: "0",
    nombre: "0",
    apellido: "0",
    correo: "0",
    clave: "0",
    dni: "0",
    cuil: "0",
    foto: "0",
    perfil: "0",
    tipo: "0",
    aprobado: "0"
  };
  mensajeEstado = ""; 
  estado = 0;

  cantidadPersonas = 0;
  ingresarCantidad = false;

  //0   => Escanear QR Local
  //1   => En lista de espera
  //2   => Mesa asignada
  //3   => 

  constructor(
    private toastController : ToastController,
    private router: Router,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 
    this.ObtenerUsuario();
    this.TraerMesas();
    this.TraerEsperas();

    setTimeout(()=>{
      this.spinner = false;
      this.VerEstado(false);
    },6000);
/*
    setTimeout(()=>{
      var date = new Date();

      var espera: Espera = {
        fecha: this.Caracteres(date.getDate().toString()) + "/" + this.Caracteres(date.getMonth().toString()) + "/" + date.getFullYear().toString(),
        hora : this.Caracteres(date.getHours().toString()) + ":" + this.Caracteres(date.getMinutes().toString()) + ":" + this.Caracteres(date.getSeconds().toString()),
        idUsuario : "10",
        nombre : "Luis",
        apellido : "Casado",
        foto : "10.jpg",
        cantPersonas : "6",
        idField: ""
      }
      this.authService.agregarEspera(espera);
    },2500);*/
  }

  Caracteres(dato: string){
    var retorno = dato.toString();
    if(dato.length == 1){
      retorno = "0" + retorno;
    }
    return retorno;
  }

  ObtenerUsuario(){
    setTimeout(()=>{
      this.authService.getUser(this.authService.usuarioActual()).then(user => {
        this.usuarioLogueado = (user as Usuario);
      });
    },2500);
  }

  TraerMesas(){
    this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
    });
  }

  TraerEsperas(){
    this.authService.listaEspera().subscribe(esperas => {
      this.listaEspera = esperas;
    });
  }

  ngOnInit() {}

  ActivarSpinner(){
    this.spinner = true;
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

  ngAfterViewInit() {
    //BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    this.stopScan();
  }

  async startScanner(){
    
    var verificar = true;
    if(this.mesas.length == 0 || this.mesas == null){
      this.TraerMesas();
      verificar = false;
    }

    if(this.listaEspera.length == 0 || this.listaEspera == null){
      this.TraerEsperas();
      verificar = false;
    }
    if(this.usuarioLogueado.idUsuario.includes("0")){
      this.ObtenerUsuario();
      verificar = false;
    }
    
    if(verificar){
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      if(result.hasContent){
        this.scanActive = false;
        this.result = result.content;
        this.AnalizarResultado();
      }
    }else{
      this.Alerta("Ocurrió un error! Reintentar", 'danger');
    }
  }

  ModificarEstado(mensaje: string){
    this.mensajeEstado = mensaje;
  }

  AbrirOpcionesMesa(){

    //CANTIDAD DE PERONAS: 0
    //nombre
    //apellido
    //foto
    //idUsuario:
    //Fecha
    //Hora
    //ABRIR VENTANA: INDICAR LA CANTIDAD DE PERSONAS
      //CANCELAR

      //ACEPTAR
        //this.estado = 1;//EN LISTA DE ESPERA
        //this.ModificarEstado("EN LISTA DE ESPERA");
        //this.AgregarListaEspera();  
  }

  ModificarOpcionesMesa(){
      //CANTIDAD DE PERONAS: INDICAR
      //idField:

      //ABRIR VENTANA: INDICAR LA CANTIDAD DE PERSONAS
        //CANCELAR

        //ACEPTAR
          //this.estado = 1;//EN LISTA DE ESPERA
          //this.ModificarEstado("EN LISTA DE ESPERA");
          //this.ModificarListaEspera(); 
  }

  AgregarListaEspera(){

  }

  ModificarListaEspera(){

  }

  AbrirMenu(){

  }

  VerEstado(flag: boolean){
    this.estado = 0;  //ESCANEAR QR LOCAL

    this.listaEspera.forEach(u => {
      if(u.idUsuario == this.usuarioLogueado.idUsuario) {
        this.estado = 1;//EN LISTA DE ESPERA
        this.ModificarEstado("EN LISTA DE ESPERA");
        if(flag){
          this.ModificarOpcionesMesa();
        }
      }
    });

    if(this.estado == 0){
      var mesasDisponibles = "";
      var cant = 0;
      this.mesas.forEach(u => {
        if(u.idUsuario == this.usuarioLogueado.idUsuario) {
          this.estado = 2;//TIENE AL MENOS 1 MESA ASIGNADA

          cant = cant + 1;
          if(cant == 1){
            mesasDisponibles = u.numMesa;
          }else{
            mesasDisponibles = mesasDisponibles + ", " + u.numMesa;
          }
        }
      });
      if(cant == 0){
        this.ModificarEstado("ESCANEAR CÓDIGO QR");
      }else{
        if(cant == 1){
          this.ModificarEstado(("MESA DISPONIBLE: " + mesasDisponibles));
        }else{
          this.ModificarEstado(("MESAS DISPONIBLES: " + mesasDisponibles));
        }
      }
    }
  }

  

  AnalizarResultado(){

    if(this.result.includes(this.qrLocal)){
      
      this.VerEstado(true);

      if(this.estado == 0){
        this.AbrirOpcionesMesa();
      }

    }else{
      var estadoMesa = 0;
      //0 MESA NO ENCONTRADA
      //1 ENCONTRADA Y NO DISPONIBLE
      //2 ENCONTRADA Y ASIGNADA

      this.mesas.forEach(u => {
        if(this.result.includes(u.qr)){
          estadoMesa = 1;
          if(this.usuarioLogueado.idUsuario == u.idUsuario){
            estadoMesa = 2;
          }
        }
      });

      if(estadoMesa == 0){
        this.Alerta("Código inválido", 'danger');
      }else{
        if(estadoMesa == 1){
          this.Alerta("MESA NO ASIGNADA", 'danger');
        }else{
          if(estadoMesa == 2){
            this.AbrirMenu();
          }
        }
      }
    }
  }

  async Alerta( mensaje : string , color : string ) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 1500,
      color: color,
      cssClass: 'custom-toast'
    });

    setTimeout(async () => {
      await toast.present();
    }, 2200);
  }

  stopScan()
  {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}
