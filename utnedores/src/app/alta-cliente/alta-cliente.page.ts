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


  GuardarUsuario()
  {
    var unUsuario: Usuario = {
      idField: "",
      idUsuario: "",
      nombre: "",
      apellido: "",
      correo: "",
      clave: "",
      dni: "",
      cuil: "",
      foto: "",
      perfil: "",
      tipo: "",
      aprobado: ""
    };

    //this.authService.addUser(unUsuario);
  }

  RegistrarUsuario(){
    var registro = {email: "correo@gmail.com", password: "123456"};
    
    //this.authService.register(registro);
  }

  ngOnInit() {

  }

}
