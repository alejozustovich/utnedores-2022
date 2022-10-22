import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';

import { getStorage, ref } from "firebase/storage";
import { uploadString } from '@angular/fire/storage';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";

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

  base64Image = "";
  options: CameraOptions = {
    quality: 50,
    allowEdit: false,
    correctOrientation: true,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL
  }

  constructor(
    private authService: AuthService ,
    private camera: Camera
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

  GuardarUsuario() {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
    }, 3000);

    var unUsuario: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
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

  TomarFoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }  

  SubirFoto() {
    var nombreImg = "usuarios/Cliente1";
    const storage = getStorage();
    const storageRef = ref(storage, nombreImg);
    uploadString(storageRef, this.base64Image, 'data_url').then((snapshot) =>{
    });

    //this.authService.subirImagenBase64(nombreImg, this.base64Image);
  }

}
