import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
})
export class EncuestaEmpleadosPage implements OnInit {
  
  formEncuesta: FormGroup;
  spinner: boolean = true;
  users: Usuario[];
  valores = [1, 2, 3, 4, 5];
  tipo = "";
  srcUserPhoto = "../../assets/user-photo.png";
  fotoCargada = false;

  constructor(
    private toastController : ToastController,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    setTimeout(() => {
      this.GuardarPerfil();
    }, 2000);
    this.DesactivarSpinner();
  }

  DesactivarSpinner(){
    setTimeout(() => {
      this.spinner = false;
    }, 6000);
  }

  ngOnInit() {
    this.formEncuesta = this.fb.group(
      {
        preguntaUno: ['', [Validators.required, Validators.pattern('^([1-5])$'), Validators.maxLength(1)]],
        preguntaDos: ['', [Validators.required]],
        preguntaTres: ['', [Validators.required]],
        preguntaCuatro: ['', [Validators.required]],
        preguntaCinco: ['1', [Validators.required]]
      }
    )
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

  get preguntaUno() {
    return this.formEncuesta.get('preguntaUno');
  }

  get preguntaDos() {
    return this.formEncuesta.get('preguntaDos');
  }

  get preguntaTres() {
    return this.formEncuesta.get('preguntaTres');
  }

  get preguntaCuatro() {
    return this.formEncuesta.get('preguntaCuatro');
  }

  get preguntaCinco() {
    return this.formEncuesta.get('preguntaCinco');
  }

  cambios(event, numero) {
    let resultado;
    for (let i = 1; i <= 5; i++) {
      if (event.target.checked) {
        resultado = numero;
        if (i < numero) {
          const input = document.getElementById(`check-${i}`);
          (input as HTMLInputElement).checked = true;
        }
      } else {
        resultado = numero - 1;
        if (i > numero) {
          const input = document.getElementById(`check-${i}`);
          (input as HTMLInputElement).checked = false;
        }
      }
    }
    if (numero == 1 && !event.target.checked) {
      this.preguntaDos.reset();
    } else {
      this.preguntaDos.setValue(resultado);
    }
  }

  ImagenCelular() { }

  Foto() { }

  GuardarPerfil() {
    var usuarioLogueado = this.authService.usuarioActual();
    setTimeout(() => {
      this.authService.getUsers().subscribe(allUsers => {
        this.users = allUsers;
        for (var i = 0; i < allUsers.length; i++) {
          if (((this.users[i].correo).toLocaleLowerCase()).includes((usuarioLogueado.toLocaleLowerCase()))) {
            this.tipo = this.users[i].tipo;
            i = allUsers.length;
          }
        }
        this.spinner = false;
      });
    }, 1500);
  }

  SaltarEncuesta() {
    this.spinner = true;
    if (this.tipo.includes("Metre")) {
      this.router.navigateByUrl('/home-metre', { replaceUrl: true });
    } else {
      if (this.tipo.includes("Mozo")) {
        this.router.navigateByUrl('/home-mozo', { replaceUrl: true });
      } else {
        if (this.tipo.includes("Bartender") || this.tipo.includes("Cocinero")) {
          this.router.navigateByUrl('/home-cocina', { replaceUrl: true });
        } else {
          this.spinner = false;
          this.Alerta("Ocurrió un error! Reintentar", 'danger');
          this.GuardarPerfil();
        }
      }
    }
  }

  enviarEncuesta() {
    console.log(this.preguntaUno.value);
    console.log(this.preguntaDos.value);
    console.log(this.preguntaTres.value);
    console.log(this.preguntaCuatro.value);
    console.log(this.preguntaCinco.value);
  }
}
