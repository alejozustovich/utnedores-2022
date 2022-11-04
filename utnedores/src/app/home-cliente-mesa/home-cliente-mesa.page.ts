import { UtilidadesService } from '../services/utilidades.service';
import { AuthService, Mesa, Usuario, Espera } from '../services/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home-cliente-mesa',
  templateUrl: './home-cliente-mesa.page.html',
  styleUrls: ['./home-cliente-mesa.page.scss'],
})
export class HomeClienteMesaPage implements OnInit {

  spinner = false;
  volumenOn = true;
  mensajeEstado = "Mesa asignada. Ya puede realizar su pedido.";

  constructor(
    private router: Router,
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { 
    this.Sonido();
  }

  ngOnInit() { }

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

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
  }

  IrPedido(){
    this.spinner = true;
    localStorage.setItem('back', '1');
    this.router.navigateByUrl('/listado-productos', { replaceUrl: true });
  }

  EstadoPedido(){
    localStorage.setItem('pedircuenta', '0');
    this.router.navigateByUrl('/estado-pedido', { replaceUrl: true });
  }

  PedirCuenta(){
    localStorage.setItem('pedircuenta', '1');
    this.router.navigateByUrl('/estado-pedido', { replaceUrl: true });
  }

  ConsultarMozo(){
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

  IrJuegos(){
    
  }

  IrEncuestas(){
    this.spinner = true;
    this.router.navigateByUrl('/encuesta-clientes', { replaceUrl: true });
  }

}
