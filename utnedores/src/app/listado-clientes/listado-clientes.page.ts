import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
})
export class ListadoClientesPage implements OnInit {

  spinner = false;
  users: Usuario[];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.TraerUsuarios();
  }

  TraerUsuarios() {
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
    });
    setTimeout(()=>{
      console.log(this.users);
    },3000);
  }

  ngOnInit() {
  }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

}
