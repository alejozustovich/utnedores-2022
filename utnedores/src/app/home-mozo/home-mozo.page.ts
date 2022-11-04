import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Pedido, Mesa } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit, AfterViewInit, OnDestroy {

  mesas: Mesa[];
  result = null;
  numMesa = "0";
  scanActive = false;
  pedidos: Pedido[];
  volumenOn = true;
  spinner = true;
  cantPedidos = 0;
  cantCierreMesas= 0;
  cantPedidosListos= 0;
  cantChat = 0;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 
    this.DesactivarSpinner();
    this.Sonido();
    this.TraerPedidos();
    this.TraerMesas();
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

  CierreMesa(){
    this.router.navigateByUrl('/cierre-mesa', { replaceUrl: true });
  }

  ChatClientes(){
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    this.stopScan();
  }

  async startScanner(){
    this.scanActive = true;
    const result = await BarcodeScanner.startScan();
    if(result.hasContent){
      this.scanActive = false;
      this.result = result.content;
      this.AnalizarResultado();
    }
  }

  TraerMesas() {
    this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
    });
  }

  AnalizarResultado(){
    var flag = false;
    this.mesas.forEach(mesa => {
      if(mesa.qr === this.result){
        flag = true;
        this.numMesa = mesa.numMesa;
        localStorage.setItem('numeroMesa', this.numMesa);
      }
    });

    if(flag){
      this.spinner = true;
      localStorage.setItem('back', '0');
      this.router.navigateByUrl('/listado-productos', { replaceUrl: true });
    }else{
      this.Alerta("Código no válido", 'danger');
      if(this.volumenOn){
        this.utilidades.SonidoError();
      }
      this.utilidades.VibrarError();
    }
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

  stopScan()
  {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  
  ngOnInit() { }

  TraerPedidos(){
    this.authService.traerPedidos().subscribe(pedidos => {
      this.cantPedidos = 0;
      this.pedidos = pedidos;
      for(var i = 0 ; i < this.pedidos.length ; i++){
        if(this.pedidos[i].estado.includes("Enviado") || this.pedidos[i].estado.includes("Preparado")){
          this.cantPedidos = this.cantPedidos + 1;
        }
      }
      this.spinner = false;
    });
  }

  DesactivarSpinner(){
    setTimeout(() => {
      this.spinner = false;
    }, 7000);
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

  ActivarSpinner(){
    this.spinner = true;
  }

  CerrarSesion(){
    this.ActivarSpinner();
    this.SonidoEgreso();
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  VerPedidos() {
    this.spinner = true;
    this.router.navigateByUrl('/mozo-ver-pedido', { replaceUrl: true });
  }

}
