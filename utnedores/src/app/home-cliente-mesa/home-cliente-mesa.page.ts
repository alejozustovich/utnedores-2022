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
  ) { }

  ngOnInit() { }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
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

  IrPedido(){
    this.spinner = true;
    this.router.navigateByUrl('/listado-productos', { replaceUrl: true });
  }

  EstadoPedido(){

  }

  ConsultarMozo(){
    
  }

  IrJuegos(){
    
  }

  IrEncuestas(){
    this.spinner = true;
    this.router.navigateByUrl('/encuesta-clientes', { replaceUrl: true });
  }

}
