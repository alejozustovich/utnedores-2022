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

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.ValidarUsuarios();
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
          this.ingresar = true;
          if(this.countPendientes > 0){
            this.hayPendientes = true;
            this.spinner = false;
          }else{
            this.hayPendientes = false;
          }
        }, 3000);
      }

    });

    setTimeout(() => {
      if(this.users.length == 0){
        //ERROR DE CONEXION
      }
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
    this.authService.register({email: correo, password: clave});

    setTimeout(() => {
      this.ingresar = true;
      this.authService.aceptarUsuario(idField);
      this.spinner = false;
      //ENVIAR CORREO AUTOMATICO ACEPTANDO AL USUARIO
    }, 2500);
    
    
  }

  RechazarCliente(idField, correo){
    //ABRIR VENTANA
      //PEDIR MOTIVO
        //ENVIAR CORREO AUTOMATICO RECHAZANDO AL USUARIO
        //this.Rechazar(idField);
  }

  Rechazar(idField){
    this.authService.rechazarUsuario(idField);
  }
}
