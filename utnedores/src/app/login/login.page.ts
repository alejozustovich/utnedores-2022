import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    private router: Router,
    private toastController: ToastController
  ) {
    this.TraerUsuarios();
  }

  TraerUsuarios() {
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
    });
  }

  ngOnInit() {
    this.formLogin = this.fb.group(
      {
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  get correo() {
    return this.formLogin.get('correo');
  }

  get clave() {
    return this.formLogin.get('clave');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2500
    });
    toast.present();
  }

  customAlertOptions = {
    header: 'Elija un usuario',
    translucent: true
  };

  llenarCampos(event) {
    this.correo.setValue(this.users[event.target.value].correo);
    this.clave.setValue(this.users[event.target.value].clave);
  }

  async iniciarSesion() {
    const data = { email: this.correo.value, password: this.clave.value }
    const user = await this.authService.login(data);
    if (user) {
      for (var i = 0; i < this.users.length; i++) {
        if (((this.users[i].correo).toLocaleLowerCase()).includes((this.correo.value.toLocaleLowerCase()))) {
          this.perfil = this.users[i].perfil;
          this.presentToast(`Bienvenido ${this.users[i].nombre}!`, 'success');
          break;
        }
      }
      if (this.perfil.includes("Dueño") || this.perfil.includes("Supervisor")) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        if (this.perfil.includes("Cliente")) {
          this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/encuesta-empleados', { replaceUrl: true });
        }
      }
     
    }
    else {
      this.presentToast('Correo o clave incorrecto/a!', 'danger');
    }
  }

}
