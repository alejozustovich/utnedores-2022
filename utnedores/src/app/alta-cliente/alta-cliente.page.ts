import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  users: Usuario[];
  idRegistroUsuario = "1";
  spinner = false;
  esRegistrado = true;
  esAnonimo = false;
  srcUserPhoto = "../../assets/user-photo.png";
  nombre = "";
  apellido = "";
  dni = "";
  correo = "";
  clave = "";
  claveConfirmada = "";
  foto = "";

  constructor(
    private toastController : ToastController ,
    private authService: AuthService
  ) { 
    this.GuardarId();
  }

	GuardarId(){
		this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
			for(var i = 0 ; i < allUsers.length ; i++)
			{
				if(Number(this.idRegistroUsuario) < Number(allUsers[i].idUsuario)) {
					this.idRegistroUsuario = allUsers[i].idUsuario;
				}
			}
			this.idRegistroUsuario = (Number(this.idRegistroUsuario) + 1).toString();
		});
	}

  async Alerta( mensaje : string , color : string ) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 1500,
      color: color,
      cssClass: 'custom-toast'
    });

    setTimeout(async () => {
      await toast.present();
    }, 2200);
  }

  SetNombre( value ) { this.nombre = value; }
  SetApellido( value ) { this.apellido = value; }
  SetDNI( value ) { this.dni = value; }
  SetCorreo( value ) { this.correo = value; }
  SetClave( value ) { this.clave = value; }
  SetClaveConfirmada( value ) { this.claveConfirmada = value; }

// INICIO Guardar Usuarios.
  GuardarUsuarioRegistrado() {
    var unUsuarioRegistrado: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      clave: this.clave,
      dni: this.dni,
      cuil: "",
      foto: "",
      perfil: "Cliente",
      tipo: "Registrado",
      aprobado: "N"
    };
    
    this.authService.addUser(unUsuarioRegistrado); //Guardar usuario a la espera de que se apruebe.
    this.Alerta('Cliente registrado correctamente' , 'success');
    setTimeout(() => {
      this.LimpiarCamposFormulario();
    }, 2200);
  }

  GuardarUsuarioAnonimo() {
    var unUsuarioAnonimo: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
      nombre: this.nombre,
      apellido: "",
      correo: this.correo,
      clave: this.clave,
      dni: "",
      cuil: "",
      foto: "",
      perfil: "Cliente",
      tipo: "Anónimo",
      aprobado: ""
    };

    this.authService.addUser(unUsuarioAnonimo); //Guardar usuario anónimo para quedarse con Nombre y Foto.
    this.Alerta('Cliente registrado correctamente' , 'success');
    setTimeout(() => {
      this.LimpiarCamposFormulario();
    }, 2200);
  }

  RegistrarUsuario(){
    var registro = {email: this.correo , password: this.clave};
    this.authService.register(registro);
  }

  GuardarUsuario() {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
    }, 2000);

    if( this.clave == this.claveConfirmada ) {
        var validarDNI: number = +this.dni;
        if(!isNaN(validarDNI)) {
          if(this.correo.includes('@')) {
            this.esRegistrado ? this.GuardarUsuarioRegistrado() : this.GuardarUsuarioAnonimo();
          } else {
            this.Alerta('El correo es inválido' , 'danger');
          }
        } else {
          this.Alerta('El DNI es inválido' , 'danger');
        }
    } else {
      this.Alerta('Las claves no coinciden' , 'danger');
    }
  }

  LimpiarCamposFormulario() {
    this.SetNombre( "" );
    this.SetApellido( "" );
    this.SetDNI( "" );
    this.SetCorreo( "" );
    this.SetClave( "" );
    this.SetClaveConfirmada( "" );
  }
// FIN Guardar Usuarios.


  ngOnInit() {

  }

  CambiarBotonTipoCliente() {

    if(this.esRegistrado) {
      this.esRegistrado = false;
      this.esAnonimo = true;
    }
    else {
      this.esRegistrado = true;
      this.esAnonimo = false;
    }
  }




}
