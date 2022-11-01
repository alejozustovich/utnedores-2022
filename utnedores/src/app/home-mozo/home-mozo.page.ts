import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Pedido } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {

  pedidos: Pedido[];
  volumenOn = true;
  spinner = true;
  cantPedidos = 0;
  cantCierreMesas= 0;
  cantPedidosListos= 0;
  cantChat = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 
    this.DesactivarSpinner();
    this.Sonido();
    this.TraerPedidos();
  }

  ngOnInit() { }
  //Enviado Confirmado Listo Terminado Entregado
  TraerPedidos(){
    this.authService.traerPedidos().subscribe(pedidos => {
      this.cantPedidos = 0;
      this.pedidos = pedidos;
      for(var i = 0 ; i < this.pedidos.length ; i++){
        if(this.pedidos[i].estado.includes("Enviado")){
          this.cantPedidos = this.cantPedidos + 1;
        }
        if(this.pedidos[i].estado.includes("Listo")){
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
