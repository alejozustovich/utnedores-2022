import { UtilidadesService } from '../services/utilidades.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {

  volumenOn = true;
  spinner = false;
  hayPedidos = false;
  
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
    
  }

}
