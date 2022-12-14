import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilidadesService } from '../services/utilidades.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alta-anonimo',
  templateUrl: './alta-anonimo.page.html',
  styleUrls: ['./alta-anonimo.page.scss'],
})

export class AltaAnonimoPage implements OnInit, AfterViewInit, OnDestroy {

  volumenOn = true;
  formRegistro: FormGroup;
  users: Usuario[];
  idRegistroUsuario = "0";
  spinner = false;
  esRegistrado = false;
  esAnonimo = true;
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
  claveRegistro = "111111111111";
  subUsers: Subscription;

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
    private toastController: ToastController,
    private authService: AuthService,
    private camera: Camera,
    private fb: FormBuilder,
    private router: Router,
    private utilidades: UtilidadesService
  ) {
    this.spinner = true;
    this.DesactivarSpinner();
    this.Sonido();
    this.GuardarId();
    this.AsignarNombreFoto();
  }
  
  Sonido(){
    try {
      var sonido = localStorage.getItem('sonido');
      if(sonido != null){
        if(sonido.includes("No")){
          this.volumenOn = false;
        }
      }
    } catch (error) {
      
    }
  }

  SonidoIngreso(){
    this.utilidades.PlayLogin();
  }

  Redirigir() {
    localStorage.setItem('sonido', "Si");
    this.router.navigateByUrl('/home-cliente', { replaceUrl: true });
    this.SonidoIngreso();
  }

  Volver() {
    this.spinner = true;
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  ngOnInit() {
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z??-??\u00f1\u00d1 ]{3,15}')]],
        apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z??-??\u00f1\u00d1 ]{3,15}')]],
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

  ImagenCelular() {
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

  ngOnDestroy(){
    this.stopScan();
  }

  PrimeraMayuscula(cadena: String) {
    var mayuscula = cadena[0].toUpperCase();
    for (var i = 1; i < cadena.length; i++) {
      if (cadena[i] != " ") {
        mayuscula = mayuscula + cadena[i].toLowerCase();
      } else {
        mayuscula = mayuscula + " " + cadena[i + 1].toUpperCase();
        i = i + 1;
      }
    }
    return mayuscula;
  }

  async startScanner() {
    this.scanActive = true;
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      this.scanActive = false;
      this.result = result.content;

      var cadena = this.result.split("@");

      var dniValido = true;
      var dniValido2 = true;
      
      if (cadena.length < 4) {
        dniValido = false;
      } else {

        if(cadena[0] != ""){
          dniValido2 = false;
        }  

        if (!isNaN(Number(cadena[1])) || !isNaN(Number(cadena[2])) || isNaN(Number(cadena[4]))) {
          dniValido = false;
        }
      }

      if (dniValido || dniValido2) {

        if(dniValido){
          this.nombre.setValue(this.PrimeraMayuscula(cadena[2]));
        }

        if(dniValido2){
          this.nombre.setValue(this.PrimeraMayuscula(cadena[5]));
        }
      } else {
        this.Alerta("C??digo no v??lido", 'danger');
        if(this.volumenOn){
          this.utilidades.SonidoError();
        }
        this.utilidades.VibrarError();
      }
    }
  }

  stopScan() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  Caracteres(dato: string) {
    var retorno = dato.toString();
    if (dato.length == 1) {
      retorno = "0" + retorno;
    }
    return retorno;
  }

  AsignarNombreFoto() {
    var date = new Date();
    this.nombreImagen = date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
  }

  Foto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.srcUserPhoto = this.base64Image;
      this.fotoFile = false;
      this.fotoCargada = true;
      this.fotoCelular = true;
    }, (err) => {
    });
  }

  GuardarId() {
    this.subUsers = this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
      for (var i = 0; i < allUsers.length; i++) {
        if (Number(this.idRegistroUsuario) < Number(allUsers[i].idUsuario)) {
          this.idRegistroUsuario = allUsers[i].idUsuario;
        }
      }
      this.idRegistroUsuario = (Number(this.idRegistroUsuario) + 1).toString();
      this.spinner = false;
      this.subUsers.unsubscribe();
    });
  }

  async Alerta(mensaje: string, color: string) {
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
      correo: (this.correo.value).toLowerCase(),
      clave: this.clave.value,
      dni: this.dni.value,
      cuil: "",
      foto: this.nombreImagen,
      perfil: "Cliente",
      tipo: "Registrado",
      aprobado: "No",
      token: ""
    };

    this.authService.addUser(unUsuarioRegistrado); //Guardar usuario a la espera de que se apruebe.

    setTimeout(() => {

      if (this.fotoCelular) {
        var rutaImagen = "usuarios/" + this.nombreImagen;
        this.authService.subirImagenBase64(rutaImagen, this.base64Image);
      }

      if (this.fotoFile) {
        var imagenStorage = "usuarios/" + this.nombreImagen;
        this.authService.subirImagenFile(imagenStorage, this.file);
      }

      this.spinner = false;
      this.clienteAgregado = true;
      if(this.volumenOn){
        this.utilidades.SonidoAlta();
      }
      setTimeout(() => {
        this.Redirigir();
      }, 2500);
    }, 2500);
  }

  GuardarUsuarioAnonimo() {

    var correoExistente = false;
    var encontrado = false;

    this.users.forEach(user => {
      if(((user.correo).toLocaleLowerCase()) === ((this.correo.value).toLocaleLowerCase())) {
        correoExistente = true;
        if(((user.nombre).toLocaleLowerCase()).includes(((this.nombre.value).toLocaleLowerCase())) == true && user.tipo.includes("An??nimo")){
          encontrado = true;
        }
      }
    });

    if(encontrado){
      this.authService.login({email: this.correo.value, password: this.claveRegistro});
      
      setTimeout(() => {
        this.Redirigir();
      }, 3000);
      
    }else{
      if(correoExistente){
        this.spinner = false;
        this.Alerta("Correo ya registrado", 'danger');
        if(this.volumenOn){
          this.utilidades.SonidoError();
        }
        this.utilidades.VibrarError();
      }else{
        var unUsuarioAnonimo: Usuario = {
          idField: "",
          idUsuario: this.idRegistroUsuario,
          nombre: this.nombre.value,
          apellido: "",
          correo: (this.correo.value).toLowerCase(),
          clave: this.claveRegistro,
          dni: "",
          cuil: "",
          foto: this.nombreImagen,
          perfil: "Cliente",
          tipo: "An??nimo",
          aprobado: "",
          token: ""
        };

        this.authService.addUser(unUsuarioAnonimo); //Guardar usuario an??nimo para quedarse con Nombre y Foto.

        setTimeout(() => {

          if (this.fotoCelular) {
            var rutaImagen = "usuarios/" + this.nombreImagen;
            this.authService.subirImagenBase64(rutaImagen, this.base64Image);
          }

          if (this.fotoFile) {
            var imagenStorage = "usuarios/" + this.nombreImagen;
            this.authService.subirImagenFile(imagenStorage, this.file);
          }

          setTimeout(() => {
            var registro = { emailNuevo: this.correo.value, passwordNuevo: this.claveRegistro };
            this.authService.ingresoAnonimo(registro);

            setTimeout(() => {
              this.spinner = false;
              this.clienteAgregado = true;
              if(this.volumenOn){
                this.utilidades.SonidoAlta();
              }
              setTimeout(() => {
                this.Redirigir();
              }, 2000);
            }, 1000);
          }, 2500);
        }, 2500);
      }
    }
  }


  DesactivarVentanas() {
    setTimeout(() => {
      this.clienteAgregado = false;
      this.spinner = false;
    }, 12000);
  }

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
    }, 7000);
  }

  GuardarUsuario() {
    this.spinner = true;
    if (this.idRegistroUsuario != "0") {
      this.esRegistrado ? this.GuardarUsuarioRegistrado() : this.GuardarUsuarioAnonimo();
    } else {
      this.spinner = false;
      this.GuardarId();
      this.Alerta("Ocurri?? un error! Reintentar", 'danger');
      if(this.volumenOn){
        this.utilidades.SonidoError();
      }
      this.utilidades.VibrarError();
    }
  }

  LimpiarCamposFormulario() {
    this.formRegistro.reset();
  }
  // FIN Guardar Usuarios.

}
