import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UtilidadesService } from '../services/utilidades.service';

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
  selectNoDisponible = true;
  selectTitle = "Cargando...";

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private utilidades: UtilidadesService
  ) {
    this.TraerUsuarios();
  }

  TraerUsuarios() {
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
      for(var i = 0 ; i < this.users.length - 1; i++){
        for(var k = i + 1; k < this.users.length ; k++){
          if((this.users[i].tipo).localeCompare(this.users[k].tipo) == 1){
            var userA = this.users[i];
            this.users[i] = this.users[k];
            this.users[k] = userA;
          }
        }
      }
      if(this.users.length == 0){
        this.selectTitle = "Error en la conexión";
      }else{
        this.selectTitle = "Acceso rápido";
        this.selectNoDisponible = false;
      }
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

  async Alerta( mensaje : string , color : string ) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 2500,
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  customAlertOptions = {
    header: 'Elija un usuario',
    translucent: true
  };

  llenarCampos(event) {
    this.email.setValue(this.users[event.target.value].correo);
    this.password.setValue(this.users[event.target.value].clave);
  }

  SonidoIngreso(){
    this.utilidades.PlayLogin();
  }

  Registrarse(){
    this.spinner = true;
    localStorage.setItem('Perfil', 'Cliente');
    this.router.navigateByUrl('/alta-cliente', { replaceUrl: true });
  }

  async iniciarSesion() {
    this.spinner = true;
    const data = { email: this.email.value, password: this.password.value }
    const user = await this.authService.login(data);
    if (user) {
      for (var i = 0; i < this.users.length; i++) {
        if (((this.users[i].correo).toLocaleLowerCase()) === ((this.email.value.toLocaleLowerCase()))) {
          this.perfil = this.users[i].perfil;
          break;
        }
      }
      localStorage.setItem('sonido', "Si");
      if (this.perfil.includes("Dueño") || this.perfil.includes("Supervisor")) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        this.SonidoIngreso();
      } else {
        if (this.perfil.includes("Cliente")) {
          this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
          this.SonidoIngreso();
        } else {
          if (this.perfil.includes("Empleado")) {
            this.router.navigateByUrl('/encuesta-empleados', { replaceUrl: true });
            this.SonidoIngreso();
          }else{
            //ERROR
            this.spinner = false;
          }
        }
      }
    }
    else {
      this.spinner = false;
      this.Alerta('Correo o clave incorrecto/a!', 'danger');
    }
  }

}
