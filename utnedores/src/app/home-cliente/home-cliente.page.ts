import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Mesa, Usuario, Espera } from '../services/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';

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

  volumenOn = true;
  esRegistrado = true;
  spinner = false;
  qrLocal = "LOCALUTNEDORES";
  idUsuario = "0";
  usuarioLogueado: Usuario;

  constructor(
    private toastController : ToastController,
    private router: Router,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 
    this.ObtenerId();
    this.TraerMesas();
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

  ObtenerId(){
    setTimeout(()=>{
      this.authService.getUser(this.authService.usuarioActual()).then(user => {
        this.idUsuario = user.idUsuario;
        this.spinner = false;
      });
    },2500);
  }

  TraerMesas(){
    this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
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
    if(this.mesas.length == 0){
      this.TraerMesas();
      verificar = false;
    }
    if(this.idUsuario.includes("0")){
      this.ObtenerId();
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

  AnalizarResultado(){

    if(this.result.includes(this.qrLocal)){
      //PREGUNTAR MESA POR MESA SI ESTA EL ID DE ESTE USUARIO
        //SI => YA TIENE LA MESA X ASIGNADA
        //NO
          //BUSCO EN LISTA DE ESPERA
            //SI  => YA ESTA EN LA LISTA DE ESPERA
            //NO  => LO AGREGO EN LA LISTA DE ESPERA
    }else{
      var mesaNoEncontrada = true;
      for(var i = 0 ; i < this.mesas.length ; i++ ){
        if(this.result.includes(this.mesas[i].qr)){
          //ENCUENTRO MESA Y PREGUNTO SI TIENE ASIGNADO EL ID DEL USUARIO
            //SI  =>  ABRO OPCIONES
            //NO  =>  MESA NO DISPONIBLE
          mesaNoEncontrada = false;
        }
      }
      if(mesaNoEncontrada){
        this.Alerta("Código inválido", 'danger');
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
