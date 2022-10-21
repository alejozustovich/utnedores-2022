import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {

  users: Usuario[];
  formRegistro: FormGroup;
  tipo: string = 'Dueño';
  idRegistroUsuario = "1";
  spinner = false;
  srcUserPhoto = "../../assets/user-photo.png";

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.GuardarId();
  }

  ngOnInit() {
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        dni: ['', [Validators.required]],
        cuil: ['', [Validators.required]],
        foto: ['', [Validators.required]],
        perfil: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6)]],
        claveConfirmada: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  get nombre() {
    return this.formRegistro.get('nombre');
  }

  get apellido() {
    return this.formRegistro.get('apellido');
  }

  get dni() {
    return this.formRegistro.get('dni');
  }

  get cuil() {
    return this.formRegistro.get('cuil');
  }

  get foto() {
    return this.formRegistro.get('foto');
  }

  get perfil() {
    return this.formRegistro.get('perfil');
  }

  get correo() {
    return this.formRegistro.get('correo');
  }

  get clave() {
    return this.formRegistro.get('clave');
  }

  get claveConfirmada() {
    return this.formRegistro.get('claveConfirmada');
  }

  cambiarTipo(tipo: string){
    this.tipo = tipo;
    this.perfil.setValue(tipo);
  }

  GuardarId() {
    this.authService.getUsers().subscribe(allUsers => {

      this.users = allUsers;

      for (var i = 0; i < allUsers.length; i++) {
        if (Number(this.idRegistroUsuario) < Number(allUsers[i].idUsuario)) {
          this.idRegistroUsuario = allUsers[i].idUsuario;
        }
      }
      this.idRegistroUsuario = (Number(this.idRegistroUsuario) + 1).toString();
    });
  }

  GuardarUsuario() {
    // var unUsuario: Usuario = {
    //   idField: "",
    //   idUsuario: "",
    //   nombre: this.nombre,
    //   apellido: this.apellido,
    //   correo: this.correo,
    //   clave: this.clave,
    //   dni: this.dni,
    //   cuil: "",
    //   foto: "",
    //   perfil: "",
    //   tipo: "",
    //   aprobado: ""
    // };

    alert(this.nombre);

    //this.authService.addUser(unUsuario);
  }

  registrarUsuario() {
    var registro = { email: "correo@gmail.com", password: "123456" };

    //this.authService.register(registro);
  }

}
