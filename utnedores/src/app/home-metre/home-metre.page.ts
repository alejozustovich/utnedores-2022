import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
})
export class HomeMetrePage implements OnInit {

  volumenOn = true;
  spinner = false;
  users: Usuario[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService
  ) { 
    this.Sonido();
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

  ngOnInit() {}

  ActivarSpinner(){
    this.spinner = true;
  }

  IrAltaCliente(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/alta-cliente', { replaceUrl: true });
  }

  IrListaEspera(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/lista-espera', { replaceUrl: true });
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
    this.ActivarSpinner();
    this.SonidoEgreso();
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
