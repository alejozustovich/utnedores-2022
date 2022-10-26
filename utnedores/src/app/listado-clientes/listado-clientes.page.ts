import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
})
export class ListadoClientesPage implements OnInit {

  volumenOn = true;
  volumenOff = false;
  spinner = true;
  users: Usuario[];
  pathFoto = "../../assets/user-photo.png";
  hayPendientes = true;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.TraerUsuarios();
    this.ValidarUsuarios();
  }

  TraerUsuarios() {
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
    });
    setTimeout(()=>{
      console.log(this.users);
    },3000);
  }

  ValidarUsuarios() {
    setTimeout(() => {
      let countPendientes = 0;
      this.users.forEach(u => {
        if(u.perfil == "Cliente" && u.tipo == "Registrado" && u.aprobado == "No") {
          countPendientes ++;
        }
      });
      (countPendientes > 0) ? this.hayPendientes = true : this.hayPendientes = false;
      console.log(this.hayPendientes);
    }, 3000);
  }

  ngOnInit() { 
    setTimeout(() => {
      this.spinner = false;
    }, 3000);
  }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home', { replaceUrl: true });
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

}
