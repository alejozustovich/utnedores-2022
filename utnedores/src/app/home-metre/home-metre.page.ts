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
      this.GuardarPerfil();
      this.ChequearConexion();
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
            i = allUsers.length;
          }
        }
        this.spinner = false;
      });
    },3500);
  }

  ChequearConexion(){
    setTimeout(()=>{
      this.spinner = false;
      if(this.users.length == 0){
        //ERROR DE CONEXION
      }
    },9000);
  }

  ngOnInit() {}

  ActivarSpinner(){
    this.spinner = true;
  }

  IrAltaCliente(){
    this.ActivarSpinner();
    this.router.navigateByUrl('/alta-cliente', { replaceUrl: true });
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
