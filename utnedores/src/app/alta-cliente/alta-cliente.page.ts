import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit, AfterViewInit, OnDestroy {
  
  formRegistro: FormGroup;
  users: Usuario[];
  idRegistroUsuario = "0";
  spinner = true;
  esRegistrado = true;
  esAnonimo = false;
  srcUserPhoto = "../../assets/user-photo.png";
  foto = "";
  fotoFile = false;
  fotoCelular = false;
  fotoCargada = false;
  file: File;
  result = null;
  scanActive = false;
  nombreImagen = "";
  base64Image = "";
  perfil = "Perfil";
  clienteAgregado = false;

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
    private camera: Camera,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.GuardarId();
    this.AsignarNombreFoto();
    setTimeout(()=>{
      this.ObtenerPerfil();
    },2500);
    this.DesactivarSpinner();
  }

  ObtenerPerfil(){
    var unPerfil = localStorage.getItem('Perfil');

    if(unPerfil === "Cliente"){
      this.perfil = "Cliente";
      localStorage.setItem('Perfil', '');
    }else{
      this.authService.getUser(this.authService.usuarioActual()).then(user => {
        this.perfil = user.perfil;
        this.spinner = false;
      });
    }    
  }

  Redirigir(){
    if(this.perfil.includes('Cliente') == true){
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }else{
      if(this.perfil.includes('Empleado') == true){
        this.router.navigateByUrl('/home-metre', { replaceUrl: true });
      }else{
        this.spinner = false;
        this.clienteAgregado = false;
        this.ObtenerPerfil();
        this.Alerta("Ocurrió un error! Reintentar", 'danger');
      }
    }
  }

  Volver(){
    this.spinner = true;
    this.Redirigir();
  }

  ngOnInit() {
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        dni: ['', [Validators.required, Validators.pattern('^([0-9])*$'), Validators.minLength(7), Validators.maxLength(8)]],
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        claveConfirmada: ['', [Validators.required]]
      },
      {
        validator: this.sonIguales('clave', 'claveConfirmada')
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

  get nombre() {
    return this.formRegistro.get('nombre');
  }

  get apellido() {
    return this.formRegistro.get('apellido');
  }

  get dni() {
    return this.formRegistro.get('dni');
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

  ImagenCelular(){
    (<HTMLInputElement>document.getElementById('inputFiles')).click();
  }

  AsignarImagen() {
    var readerVar = new FileReader();
    readerVar.readAsDataURL(this.file);
    readerVar.onload = (_event) => {
      this.srcUserPhoto = (readerVar.result).toString();
    }
  }

  Cargar(event: any): void {
    this.file = event.target.files[0];
    this.AsignarImagen();
    this.fotoCargada = true;
    this.fotoFile = true;
    this.fotoCelular = false;
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

      var dniValido = true;
      var cadena = this.result.split("@");

      if(cadena.length < 4){
        dniValido = false;
      }else{
        if(!isNaN(Number(cadena[1])) || !isNaN(Number(cadena[2])) || isNaN(Number(cadena[4]))){
          dniValido = false;
        }
      }

      if(dniValido){
        this.nombre.setValue(this.PrimeraMayuscula(cadena[2]));
        this.apellido.setValue(this.PrimeraMayuscula(cadena[1]));
        this.dni.setValue(cadena[4]);

      }else{
        this.Alerta("Código no válido", 'danger');
      }
    }
  }

  stopScan(){
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
      this.fotoFile = false;
      this.fotoCargada = true;
      this.fotoCelular = true;
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
      duration: 2500,
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

// INICIO Guardar Usuarios.
  GuardarUsuarioRegistrado() {
    var unUsuarioRegistrado: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
      nombre: this.nombre.value,
      apellido: this.apellido.value,
      correo: this.correo.value,
      clave: this.clave.value,
      dni: this.dni.value,
      cuil: "",
      foto: this.nombreImagen,
      perfil: "Cliente",
      tipo: "Registrado",
      aprobado: "No"
    };
    
    this.authService.addUser(unUsuarioRegistrado); //Guardar usuario a la espera de que se apruebe.
    
    setTimeout(() => {

      if(this.fotoCelular){
        var rutaImagen = "usuarios/" + this.nombreImagen;
        this.authService.subirImagenBase64(rutaImagen, this.base64Image);
      }

      if(this.fotoFile){
        var imagenStorage = "usuarios/" + this.nombreImagen;
        this.authService.subirImagenFile(imagenStorage, this.file);
      }

      this.spinner = false;
      this.clienteAgregado = true;
      setTimeout(() => {
        this.Redirigir();
      }, 2500);
    }, 2500);
  }


  GuardarUsuarioAnonimo() {
    var unUsuarioAnonimo: Usuario = {
      idField: "",
      idUsuario: this.idRegistroUsuario,
      nombre: this.nombre.value,
      apellido: "",
      correo: this.correo.value,
      clave: this.clave.value,
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

      setTimeout(() => {
        this.RegistrarUsuario();

        this.spinner = false;
        this.clienteAgregado = true;
        setTimeout(() => {
          this.Redirigir();
        }, 2500);
      }, 2000);
    }, 2000);
  }

  RegistrarUsuario(){
    var registro = {email: this.correo , password: this.clave};
    this.authService.register(registro);
  }

  DesactivarVentanas(){
    setTimeout(()=>{
      this.clienteAgregado = false;
      this.spinner = false;
    },12000);
  }

  DesactivarSpinner(){
    setTimeout(()=>{
      this.spinner = false;
    },7000);
  }

  GuardarUsuario() {
    this.spinner = true;
    this.DesactivarVentanas();
    if( this.clave == this.claveConfirmada ) {
        var validarDNI: number = +this.dni;
        if(!isNaN(validarDNI)) {
          if(this.correo.value.includes('@')) {
            if(this.idRegistroUsuario != "0"){
              this.esRegistrado ? this.GuardarUsuarioRegistrado() : this.GuardarUsuarioAnonimo();
            }else{
              this.spinner = false;
              this.GuardarId();
              this.Alerta("Ocurrió un error! Reintentar", 'danger');
            }
          } else {
            this.spinner = false;
            this.Alerta('El correo es inválido' , 'danger');
          }
        } else {
          this.spinner = false;
          this.Alerta('El DNI es inválido' , 'danger');
        }
    } else {
      this.spinner = false;
      this.Alerta('Las claves no coinciden' , 'danger');
    }
  }

  LimpiarCamposFormulario() {
    this.formRegistro.reset();
  }
// FIN Guardar Usuarios.

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
