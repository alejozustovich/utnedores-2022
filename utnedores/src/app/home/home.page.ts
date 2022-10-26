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
  volumenOff = false;
  spinner = false;
  perfil = "Perfil";
  users: Usuario[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService
    ) { 
      this.ActivarSpinner();
      this.GuardarPerfil();
    }

  GuardarPerfil(){
    var usuarioLogueado
    setTimeout(()=>{
      usuarioLogueado = this.authService.usuarioActual();
    },2000);
    setTimeout(()=>{
      this.authService.getUsers().subscribe(allUsers => {
        this.users = allUsers;
        for(var i = 0 ; i < allUsers.length ; i++)
        {
          if(((this.users[i].correo).toLocaleLowerCase()).includes((usuarioLogueado.toLocaleLowerCase()))) {
            this.perfil = this.users[i].perfil;
            i = allUsers.length;
          }
        }
        this.spinner = false;
      });
    },3000);
  }

  ngOnInit() { }

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

