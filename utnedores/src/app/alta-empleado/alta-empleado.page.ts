import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit, AfterViewInit, OnDestroy {
  
  formRegistro: FormGroup;
  users: Usuario[];
  idRegistroUsuario = "0";
  spinner = false;
  esRegistrado = true;
  esAnonimo = false;
  srcUserPhoto = "../../assets/user-photo.png";
  foto = "";
  fotosLleno = false;
  fotoFile = false;
  fotoCelular = false;
  file: File;
  result = null;
  scanActive = false;
  nombreImagen = "";
  base64Image = "";
  empleadoAgregado = false;

  currentEmail = "";
  currentPassword = "";

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
    private router: Router,
    private fb: FormBuilder
  ) {
    this.spinner = true;
    this.DesactivarSpinner();
    this.GuardarId();
    this.AsignarNombreFoto();
    setTimeout(() => {
      this.ObtenerPerfil();
    }, 2500);
  }
  
  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
    }, 7000);
  }

  ObtenerPerfil() {
    this.authService.getUser(this.authService.usuarioActual()).then(user => {
      this.currentEmail = user.correo;
      this.currentPassword = user.clave;
      this.spinner = false;
    });
  }

  ngOnInit() {
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{3,15}')]],
        apellido: ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{3,15}')]],
        dni: ['', [Validators.required, Validators.pattern('^([0-9])*$'), Validators.minLength(7), Validators.maxLength(8)]],
        cuil: ['', [Validators.required]],
        tipo: ['', [Validators.required]],
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
      const re = new RegExp('^[0-9]{2}-(' + valorControlA + ')-[0-9]$');
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

  get tipo() {
    return this.formRegistro.get('tipo');
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

  Volver() {
    this.spinner = true;
    this.Redirigir();
  }

  Redirigir(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
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
    this.fotosLleno = true;
    this.fotoFile = true;
    this.fotoCelular = false;
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

  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    this.stopScan();
  }

  async startScanner() {
    this.scanActive = true;
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
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
        this.cuil.setValue(("-" + cadena[4] + "-"));
      }else{
        this.Alerta("Código no válido", 'danger');
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
      this.fotosLleno = true;
      this.fotoFile = false;
      this.fotoCelular = true;
    }, (err) => {
    });
  }

  LimpiarFoto() {
    this.srcUserPhoto = "../../assets/user-photo.png";
    this.base64Image = "";
    this.fotosLleno = false;
    this.fotoFile = false;
    this.fotoCelular = false;
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

  DesactivarVentanas(){
    setTimeout(()=>{
      this.empleadoAgregado = false;
      this.spinner = false;
    },12000);
  }

  // INICIO Guardar Usuarios.
  GuardarEmpleado() {
    this.spinner = true;
    this.DesactivarVentanas();
    if(this.idRegistroUsuario != "0"){
      if (!this.fotoCelular && !this.fotoFile) {
        this.nombreImagen = "";
      }
      var unUsuario: Usuario = {
        idField: "",
        idUsuario: this.idRegistroUsuario,
        nombre: this.nombre.value,
        apellido: this.apellido.value,
        correo: this.correo.value,
        clave: this.clave.value,
        dni: this.dni.value,
        cuil: this.cuil.value,
        foto: this.nombreImagen,
        perfil: "Empleado",
        tipo: this.tipo.value,
        aprobado: ""
      };
  
      this.authService.addUser(unUsuario);
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
          this.RegistrarUsuario();

          this.spinner = false;
          this.empleadoAgregado = true;
          setTimeout(() => {
            this.Redirigir();
          }, 2500);
        }, 2500);
  
      }, 2000);
    }else{
      this.spinner = false;
      this.GuardarId();
      this.Alerta("Ocurrió un error! Reintentar", 'danger');
    }    
  }

  RegistrarUsuario() {
    var registro = { emailNuevo: this.correo.value, passwordNuevo: this.clave.value };
    var currentUser = { emailCurrent: this.currentEmail, passwordCurrent: this.currentPassword };
    this.authService.register(registro, currentUser);
  }

  LimpiarCamposFormulario() {
    this.formRegistro.reset();
    this.LimpiarFoto();
  }
  // FIN Guardar Usuarios.

}

