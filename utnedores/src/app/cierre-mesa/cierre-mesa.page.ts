import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Cuenta, Mesa, Pedido } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cierre-mesa',
  templateUrl: './cierre-mesa.page.html',
  styleUrls: ['./cierre-mesa.page.scss'],
})
export class CierreMesaPage implements OnInit {

  cuentas: Cuenta[];
  hayCuenta = false;
  cargando = true;
  cierrePendiente = false;
  cierreListo = false;
  cierresPendientes = [];
  cierresListos = [];
  spinner = true;
  volumenOn = true;
  mesas: Mesa[];
  pedidos: Pedido[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private utilidades: UtilidadesService
  ) { 
    this.Sonido();
    this.DesactivarSpinner();
    this.TraerCuentas();
    this.TraerMesas();
    this.TraerPedidos();
  }

  ngOnInit() {
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

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
    }, 7000);
  }

  TraerPedidos(){
    this.authService.traerPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;
    });
  }

  TraerMesas() {
    this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
    });
  }

  TraerCuentas() {
    this.authService.traerCuentas().subscribe(listaCuentas => {

      this.cierrePendiente = false;
      this.cierreListo = false;
      var cierresPendientesAux = [];
      var cierresListosAux = [];

      this.cuentas = listaCuentas;
      if(this.cuentas.length > 0){
        this.hayCuenta = true;
      }

      this.cuentas.forEach(cuenta => {
        if(cuenta.idUsuario.includes("-1")){
          var unaCuenta = {
            idField: cuenta.idField,
            idUsuario: cuenta.idUsuario,
            consumo: cuenta.total,
            propina: cuenta.propina,
            mesas: cuenta.mesas,
            total: ((Number(cuenta.total)) + (Number(cuenta.propina)))
          };
          cierresListosAux.push(unaCuenta);
          this.cierreListo = true;
        }
        if(!cuenta.idUsuario.includes("-1")){
          var unaCuenta = {
            idField: cuenta.idField,
            idUsuario: cuenta.idUsuario,
            consumo: cuenta.total,
            propina: cuenta.propina,
            mesas: cuenta.mesas,
            total: ((Number(cuenta.total)) + (Number(cuenta.propina)))
          };
          cierresPendientesAux.push(unaCuenta);
          this.cierrePendiente = true;
        }
      });

      this.cierresPendientes = cierresPendientesAux;
      this.cierresListos = cierresListosAux;

      setTimeout(() => {
        this.cargando = false;
        this.spinner = false;
      }, 1500);
    });
  }

  async Alerta(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'bottom',
      duration: 2500,
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async Cerrar(idField: string, idUsuario: string){
    this.spinner = true;
    this.DesactivarSpinner();
    for(var i = 0 ; i < this.mesas.length ; i++){
      if(this.mesas[i].idUsuario === idUsuario){
        this.authService.liberarMesa(this.mesas[i].idField);
        await new Promise(f => setTimeout(f, 1000));
      }
    }

    for(var i = 0 ; i < this.pedidos.length ; i++){
      if(this.pedidos[i].idUsuario === idUsuario){
        this.authService.eliminarPedido(this.pedidos[i].idField);
        await new Promise(f => setTimeout(f, 1000));
      }
    }

    //LIMPIAR CHATS



    this.authService.cerrarCuenta(idField);
    this.spinner = false;
    this.Alerta("Cierre exitoso!",'success');
    if(this.volumenOn){
      this.utilidades.SonidoConfirmar();
    }
  }

  Volver(){
    this.router.navigateByUrl('/home-cliente-mesa', { replaceUrl: true });
  }
}