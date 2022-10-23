import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  users: Usuario[];
  formRegistro: FormGroup;
  perfil: string = 'Dueño';
  idRegistroUsuario = "1";
  spinner = false;
  srcUserPhoto = "../../assets/user-photo.png";

  constructor(private authService: AuthService, private fb: FormBuilder, private toastController: ToastController) { }

  ngOnInit() {
    this.traerUsuarios();
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        dni: ['', [Validators.required, Validators.pattern('^([0-9])*$'), Validators.minLength(7), Validators.maxLength(8)]],
        cuil: ['', [Validators.required]],
        foto: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        claveConfirmada: ['', [Validators.required]]
      },
      {
        validator: [this.sonIguales('clave', 'claveConfirmada'),
        this.cuilCorrecto('dni', 'cuil')]
      }
    )
  }

  private sonIguales(nombreControlA, nombreControlB): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const valorControlA = formGroup.get(nombreControlA).value;
      const valorControlB = formGroup.get(nombreControlB).value;

      if (valorControlA == valorControlB) {
        return null;
      } else {
        return { noCoinciden: true }
      }
    }
  }

  private cuilCorrecto(nombreControlA, nombreControlB): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const valorControlA = formGroup.get(nombreControlA)?.value;
      const valorControlB = formGroup.get(nombreControlB)?.value;
      const re = new RegExp('^[0-9]{2}-('+valorControlA+')-[0-9]$');
      if (re.test(valorControlB)) {
        return null;
      } else {
        return { cuilIncorrecto: true }
      }
    }
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

  get correo() {
    return this.formRegistro.get('correo');
  }

  get clave() {
    return this.formRegistro.get('clave');
  }

  get claveConfirmada() {
    return this.formRegistro.get('claveConfirmada');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2500
    });
    toast.present();
  }

  cambiarPerfil(perfil: string) {
    this.perfil = perfil;
  }

  asignarID(usuarios: Usuario[]) {
    for (var i = 0; i < usuarios.length; i++) {
      if (Number(this.idRegistroUsuario) < Number(usuarios[i].idUsuario)) {
        this.idRegistroUsuario = usuarios[i].idUsuario;
      }
    }
    this.idRegistroUsuario = (Number(this.idRegistroUsuario) + 1).toString();
  }

  traerUsuarios() {
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
      // console.log(this.users);
      this.asignarID(this.users);
    });
  }

  verificarUsuario(usuario: Usuario) {
    let retorno = true;
    this.users.forEach(user => {
      if (user.correo == usuario.correo || user.dni == usuario.dni || user.cuil == usuario.cuil) {
        retorno = false;
      }
    })
    return retorno;
  }

  async registrarUsuario() {
    this.spinner = true;
    const usuario: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      correo: this.correo.value,
      clave: this.clave.value,
      dni: this.dni.value,
      cuil: this.cuil.value,
      foto: this.foto.value,
      perfil: this.perfil,
      tipo: "",
      aprobado: "si"
    };
    const registro = { email: usuario.correo, password: usuario.clave };

    if (this.verificarUsuario(usuario)) {
      try {
        // await this.authService.register(registro);
        // await this.authService.addUser(usuario);
        this.presentToast('Usuario creado correctamente!', 'success');
      } catch (e) {
        console.log(e);
        this.presentToast('Error al crear usuario!', 'danger');
      } finally {
        this.spinner = false;
      }
    } else {
      this.spinner = false;
      this.presentToast('Ya existe un usuario con esos datos!', 'danger');
    }
  }

}
