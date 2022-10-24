import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;
  spinner = false;

  users: Usuario[];
  perfil = "";
  tipo = "";

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
    ) {
      this.TraerUsuarios();
    }

  TraerUsuarios(){
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
    });
  }

  ngOnInit() {
    this.formLogin = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  get email() {
    return this.formLogin.get('email');
  }

  get password() {
    return this.formLogin.get('password');
  }

  async iniciarSesion(){

    const user = await this.authService.login(this.formLogin.value);
    
    if(user){
      for(var i = 0 ; i < this.users.length ; i++)
      {
        if(((this.users[i].correo).toLocaleLowerCase()).includes((this.formLogin.value.email.toLocaleLowerCase()))) {
          this.perfil = this.users[i].perfil;
        }
      }
  
      if(this.perfil.includes("Dueño") || this.perfil.includes("Supervisor")){
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }else{
        if(this.perfil.includes("Cliente")){
          this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
        }else{
          this.router.navigateByUrl('/encuesta-empleados', { replaceUrl: true });
        }
      }
    }
    else{
      //MENSAJE ERROR
    }
  }

}
