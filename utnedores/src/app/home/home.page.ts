import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  volumenOn = true;
  spinner = true;
  perfil = "Perfil";

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService
    ) { 
      this.Sonido();
      this.ObtenerPerfil();
      this.DesactivarSpinner();
    }

  DesactivarSpinner(){
    setTimeout(()=>{
      this.spinner = false;
    },5000);
  }

  ObtenerPerfil(){
    setTimeout(()=>{
      this.authService.getUser(this.authService.usuarioActual()).then(user => {
        this.perfil = user.perfil;
        this.spinner = false;
      });
    },2500);
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

  IrAltaSupervisor(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/alta-supervisor', { replaceUrl: true });
  }

  IrAltaEmpleado(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/alta-empleado', { replaceUrl: true });
  }

  IrAltaMesa(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/alta-mesa', { replaceUrl: true });
  }

  IrAprobarClientes(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/listado-clientes', { replaceUrl: true });
  }

  IrVerReservas(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/reservas', { replaceUrl: true });
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

}