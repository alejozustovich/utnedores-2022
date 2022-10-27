import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
})
export class EncuestaEmpleadosPage implements OnInit {
  formEncuesta: FormGroup;
  spinner: boolean = false;
  users: Usuario[];
  tipo = "";
  srcUserPhoto = "../../assets/user-photo.png";
  fotoCargada = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    //COMIENZO SPINNER
    setTimeout(() => {
      this.GuardarPerfil();
    }, 1500);
  }

  ngOnInit() {
    this.formEncuesta = this.fb.group(
      {
        preguntaUno: ['', [Validators.required, Validators.pattern('^([1-5])*$'), Validators.maxLength(1)]],
        preguntaDos: ['', [Validators.required]],
        preguntaTres: ['', [Validators.required]],
        preguntaCuatro: ['', [Validators.required]],
        preguntaCinco: ['', [Validators.required]]
      }
    )
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

  cambios(event, numero){
    let respuesta;
    for(let i=1; i <= 5; i++){
      if(event.target.checked){
        respuesta = numero;
        if(i<numero){
         const input =  document.getElementById(`check-${i}`);
         (input as HTMLInputElement).checked = true;
        }
      }else{
        respuesta = numero-1;
        if(i>numero){
          const input =  document.getElementById(`check-${i}`);
          (input as HTMLInputElement).checked = false;
         }
      }
    }
    if(numero == 1 && !event.target.checked){
      this.preguntaDos.reset();
      console.log(this.preguntaDos.invalid);
    }
    this.preguntaDos.setValue(respuesta);
  }

  ImagenCelular(){}

  Foto(){}

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
        //FIN SPINNER
      });
    }, 1500);
  }

  SaltarEncuesta() {
    if (this.tipo.includes("Metre")) {
      this.router.navigateByUrl('/home-metre', { replaceUrl: true });
    } else {
      if (this.tipo.includes("Mozo")) {
        this.router.navigateByUrl('/home-mozo', { replaceUrl: true });
      } else {
        if (this.tipo.includes("Bartender") || this.tipo.includes("Cocinero")) {
          this.router.navigateByUrl('/home-cocina', { replaceUrl: true });
        } else {
          //Error
        }
      }
    }
  }

  enviarEncuesta(){
    console.log(this.preguntaUno.value);
    console.log(this.preguntaDos.value);
    console.log(this.preguntaTres.value);
    console.log(this.preguntaCuatro.value);
    console.log(this.preguntaCinco.value);
  }
}
