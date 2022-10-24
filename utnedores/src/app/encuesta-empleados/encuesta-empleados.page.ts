import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
})
export class EncuestaEmpleadosPage implements OnInit {

  users: Usuario[];
  tipo = "";

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
      //COMIENZO SPINNER
      setTimeout(()=>{
       this.GuardarPerfil();
      },1500);
   }

  ngOnInit() {

  }

  GuardarPerfil(){
    var usuarioLogueado = this.authService.usuarioActual();
    setTimeout(()=>{
      this.authService.getUsers().subscribe(allUsers => {
        this.users = allUsers;
        for(var i = 0 ; i < allUsers.length ; i++)
        {
          if(((this.users[i].correo).toLocaleLowerCase()).includes((usuarioLogueado.toLocaleLowerCase()))) {
            this.tipo = this.users[i].tipo;
            i = allUsers.length;
          }
        }
        //FIN SPINNER
      });
     },1500);
	}

  SaltarEncuesta(){
    if(this.tipo.includes("Metre")){
      this.router.navigateByUrl('/home-metre', { replaceUrl: true });
    }else{
      if(this.tipo.includes("Mozo")){
        this.router.navigateByUrl('/home-mozo', { replaceUrl: true });
      }else{
        if(this.tipo.includes("Bartender") || this.tipo.includes("Cocinero")){
          this.router.navigateByUrl('/home-cocina', { replaceUrl: true });
        }else{
          //Error
        }
      }
    }
  }
}
