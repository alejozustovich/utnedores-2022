import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit, AfterViewInit, OnDestroy {

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

  result = null;
  scanActive = false;

  nombreImagen = "";
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
    private toastController : ToastController,
    private authService: AuthService,
    private camera: Camera
  ) { 
    this.GuardarId();
    this.AsignarNombreFoto();
  }


  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    this.stopScan();
  }


  PrimeraMayuscula(cadena: String){
    var mayuscula = cadena[0].toUpperCase();
    for(var i = 1 ; i < cadena.length ; i++){
      if(cadena[i] != " "){
        mayuscula = mayuscula + cadena[i].toLowerCase();
      }else{
        mayuscula = mayuscula + " " + cadena[i+1].toUpperCase();
        i = i + 1;
      }
    }
    return mayuscula;
  }

  
  async startScanner(){
    
    this.scanActive = true;
    const result = await BarcodeScanner.startScan();
    if(result.hasContent){
      this.scanActive = false;
      this.result = result.content;
      var cadena = this.result.split("@");

      this.nombre = this.PrimeraMayuscula(cadena[2]);
      this.apellido = this.PrimeraMayuscula(cadena[1]);
      this.dni = cadena[4];
      this.SetNombre(this.nombre);
      this.SetApellido(this.apellido);
      this.SetDNI(this.dni);
    }
  }

  stopScan()
  {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  
  Caracteres(dato: string){
    var retorno = dato.toString();
    if(dato.length == 1){
      retorno = "0" + retorno;
    }
    return retorno;
  }


  AsignarNombreFoto(){
    var date = new Date();
    this.nombreImagen =  date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
  }

  Foto(){
    this.camera.getPicture(this.options).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.srcUserPhoto = this.base64Image;

    }, (err) => {
    });
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
      foto: this.nombreImagen,
      perfil: "Cliente",
      tipo: "Registrado",
      aprobado: "No"
    };
    
    this.authService.addUser(unUsuarioRegistrado); //Guardar usuario a la espera de que se apruebe.
    
    setTimeout(() => {
      var rutaImagen = "usuarios/" + this.nombreImagen;
      this.authService.subirImagenBase64(rutaImagen, this.base64Image);
    }, 2000);

    this.Alerta('Cliente registrado correctamente' , 'success');
    setTimeout(() => {
      this.LimpiarCamposFormulario();
    }, 5000);
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
      foto: this.nombreImagen,
      perfil: "Cliente",
      tipo: "Anónimo",
      aprobado: ""
    };

    this.authService.addUser(unUsuarioAnonimo); //Guardar usuario anónimo para quedarse con Nombre y Foto.
    
    setTimeout(() => {
      var rutaImagen = "usuarios/" + this.nombreImagen;
      this.authService.subirImagenBase64(rutaImagen, this.base64Image);
    }, 2000);

    setTimeout(() => {
      this.RegistrarUsuario();
    }, 4000);

    this.Alerta('Cliente registrado correctamente' , 'success');
    setTimeout(() => {
      //Redirigir
    }, 6000);
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
