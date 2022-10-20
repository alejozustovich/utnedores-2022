import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';

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
    private authService: AuthService
  ) { 
    this.GuardarId();
  }

	GuardarId(){
		this.authService.getUsers().subscribe(allUsers => {

      this.users = allUsers;

			for(var i = 0 ; i < allUsers.length ; i++)
			{
				if(Number(this.idRegistroUsuario) < Number(allUsers[i].idUsuario))
				{
					this.idRegistroUsuario = allUsers[i].idUsuario;
				}
			}
			this.idRegistroUsuario = (Number(this.idRegistroUsuario) + 1).toString();
		});
	}

  SetNombre( value ) { this.nombre = value; }
  SetApellido( value ) { this.apellido = value; }
  SetDNI( value ) { this.dni = value; }
  SetCorreo( value ) { this.correo = value; }
  SetClave( value ) { this.clave = value; }
  SetClaveConfirmada( value ) { this.claveConfirmada = value; }

  GuardarUsuario()
  {
    var unUsuario: Usuario = {
      idField: "",
      idUsuario: "",
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      clave: this.clave,
      dni: this.dni,
      cuil: "",
      foto: "",
      perfil: "",
      tipo: "",
      aprobado: ""
    };

    alert(this.nombre);

    //this.authService.addUser(unUsuario);
  }

  RegistrarUsuario(){
    var registro = {email: "correo@gmail.com", password: "123456"};
    
    //this.authService.register(registro);
  }

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
