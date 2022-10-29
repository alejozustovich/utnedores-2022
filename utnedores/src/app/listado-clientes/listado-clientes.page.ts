import { Component, OnInit } from '@angular/core';
import { getStorage, ref } from "firebase/storage";
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
})
export class ListadoClientesPage implements OnInit {

  volumenOn = true;
  volumenOff = false;
  spinner = true;
  users: Usuario[];
  pathFoto = "../../assets/user-photo.png";
  hayPendientes = false;
  countPendientes = 0;
  ingresar = true;
  currentEmail = "";
  currentPassword = "";
  ingresarMotivoRechazo = false;
  cargando = true;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.DesactivarSpinner();
    this.ValidarUsuarios();
    setTimeout(() => {
      this.ObtenerPerfil();
    }, 2500);
  }

  DesactivarSpinner() {
    setTimeout(() => {
      this.spinner = false;
      this.cargando = false;
    }, 6000);
  }

  ObtenerPerfil() {
    this.authService.getUser(this.authService.usuarioActual()).then(user => {
      this.currentEmail = user.correo;
      this.currentPassword = user.clave;
    });
  }

  async ValidarUsuarios() {

    this.authService.getUsers().subscribe(allUsers => {
      if(this.ingresar){
        this.ingresar = false;
        this.users = allUsers;
        this.users.forEach(u => {
          if(u.perfil == "Cliente" && u.tipo == "Registrado" && u.aprobado == "No") {
            
            var fotoBuscar = "usuarios/" + u.foto;
            const storage = getStorage();
            const storageRef = ref(storage, fotoBuscar);
            getDownloadURL(storageRef).then((response) => {
              u.foto = response;
            });
            this.countPendientes ++;
          }
        });
        setTimeout(() => {
          if(this.countPendientes > 0){
            this.hayPendientes = true;
          }else{
            this.hayPendientes = false;
          }
          setTimeout(() => {
            this.ingresar = true;
          }, 5500);
        }, 3000);
      }
    });

    setTimeout(() => {
      if(this.users.length == 0){
        //ERROR DE CONEXION
      }
      this.cargando = false;
      this.spinner = false;
    }, 7000);
  }

  ngOnInit() { 
    
  }

  Volver(){
    this.spinner = true;
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  AprobarCliente(idField, correo, clave){
    this.spinner = true;
    this.authService.aceptarUsuario(idField);

    setTimeout(() => {
      var currentUser = { emailCurrent: this.currentEmail, passwordCurrent: this.currentPassword };
      this.authService.register({emailNuevo: correo, passwordNuevo: clave}, currentUser);
      this.DesactivarSpinner();
      //ENVIAR CORREO AUTOMATICO ACEPTANDO AL USUARIO
    }, 3000);
    
    
  }

  RechazarCliente(idField, correo){
    this.ingresarMotivoRechazo = true;
    //ABRIR VENTANA
      //PEDIR MOTIVO
        //ENVIAR CORREO AUTOMATICO RECHAZANDO AL USUARIO
        //this.Rechazar(idField);
  }

  Rechazar(idField){
    this.authService.rechazarUsuario(idField);
  }

  Cancelar() {
    this.ingresarMotivoRechazo = false;
  }
}
