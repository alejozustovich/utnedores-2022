import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService, Usuario } from '../services/auth.service';
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {
  users: Usuario[];
  formRegistro: FormGroup;
  perfil: string = 'Dueño';
  idRegistroUsuario = "0";
  spinner = false;
  srcUserPhoto = "../../assets/user-photo.png";
  fotoFile = false;
  fotoCelular = false;
  file: File;
  result = null;
  scanActive = false;
  fotoCargada = false;
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
    private authService: AuthService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private camera: Camera,
    private router: Router
  ) {
    this.AsignarNombreFoto();
  }

  Volver(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
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

  ngOnInit() {
    this.traerUsuarios();
    this.formRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,15}')]],
        dni: ['', [Validators.required, Validators.pattern('^([0-9])*$'), Validators.minLength(7), Validators.maxLength(8)]],
        cuil: ['', [Validators.required]],
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
      (<HTMLInputElement>document.getElementById('nomHtml')).value = this.PrimeraMayuscula(cadena[2]);
      (<HTMLInputElement>document.getElementById('apeHtml')).value = this.PrimeraMayuscula(cadena[1]);
      (<HTMLInputElement>document.getElementById('dniHtml')).value = this.PrimeraMayuscula(cadena[4]);
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
      this.fotoCargada = true;
      this.fotoFile = false;
      this.fotoCelular = true;
    }, (err) => {
    });
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

    if(!this.idRegistroUsuario.includes("0")){
      const usuario: Usuario = {
        idField: "",
        idUsuario: this.idRegistroUsuario,
        nombre: this.nombre.value,
        apellido: this.apellido.value,
        correo: this.correo.value,
        clave: this.clave.value,
        dni: this.dni.value,
        cuil: this.cuil.value,
        foto: this.nombreImagen,
        perfil: this.perfil,
        tipo: this.perfil,
        aprobado: ""
      };
      const registro = { email: usuario.correo, password: usuario.clave };
      console.log(usuario);
      if (this.verificarUsuario(usuario)) {
        try {
          this.authService.addUser(usuario);

          setTimeout(() => {
            if(this.fotoCelular){
              var rutaImagen = "usuarios/" + this.nombreImagen;
              this.authService.subirImagenBase64(rutaImagen, this.base64Image);
            }
        
            if(this.fotoFile){
              var imagenStorage = "usuarios/" + this.nombreImagen;
              this.authService.subirImagenFile(imagenStorage, this.file);
            }
          }, 2000);

          setTimeout(() => {
            this.authService.register(registro);
          }, 4000);

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

    }else{
      this.spinner = false;
      this.presentToast("Ocurrió un error! Reintentar", 'danger');
      this.traerUsuarios();
    }
  }

}
