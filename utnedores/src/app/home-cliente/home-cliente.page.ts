import { Component, OnInit } from '@angular/core';
import { UtilidadesService } from '../services/utilidades.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {

  volumenOn = true;
  volumenOff = false;
  esRegistrado = true;
  spinner = false;

  constructor(
    private authService: AuthService,
    private utilidades: UtilidadesService
  ) { }

  ngOnInit() { }


  ActivarDesactivarSonido() {
    if(this.volumenOn) {
      this.volumenOn = false;
      this.volumenOff = true;
      localStorage.setItem('sonido', "No");
    } else {
      this.volumenOn = true;
      this.volumenOff = false;
      localStorage.setItem('sonido', "Si");
    }
  }

  SonidoEgreso(){
    var reproducir = localStorage.getItem('sonido');
    try {
      if(reproducir.includes("Si")){
        this.utilidades.PlayLogout();
      }  
    } catch (error) {
      
    }
    localStorage.clear();
  }

  CerrarSesion(){
    this.spinner = true;
    this.SonidoEgreso();
    this.authService.logout();
  }
}
