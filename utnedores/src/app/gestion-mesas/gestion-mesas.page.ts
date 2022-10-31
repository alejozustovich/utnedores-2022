import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Espera, Usuario, Mesa } from '../services/auth.service';
import { getDownloadURL } from '@angular/fire/storage';
import { getStorage, ref } from "firebase/storage";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-mesas',
  templateUrl: './gestion-mesas.page.html',
  styleUrls: ['./gestion-mesas.page.scss'],
})
export class GestionMesasPage implements OnInit {

  cargando = true;
  mesas: Mesa [];
  mesasOcupadas = false;
  spinner = false;

  constructor(
    private toastController: ToastController,
    public router: Router ,
    private authService: AuthService
  ) { 
    this.ActivarSpinner();
    this.TraerMesas();
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

  TraerMesas() {
    this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;

      this.mesas.forEach(u => {
        const storage = getStorage();
        const storageRef = ref(storage, ("mesas/" + u.foto));

        getDownloadURL(storageRef).then((response) => {
          u.foto = response;
        });
        if(u.idUsuario != "0"){
          this.mesasOcupadas = true;
        }
      });

      for(var i = 0 ; i < this.mesas.length - 1; i++){
        for(var k = i + 1 ; k < this.mesas.length; k++){
          if((Number(this.mesas[i].numMesa)) > (Number(this.mesas[k].numMesa))){
            var mesaAux = this.mesas[i];
            this.mesas[i] = this.mesas[k];
            this.mesas[k] = mesaAux;
          }
        }
      }
      this.spinner = false;
      this.cargando = false
    });
    setTimeout(() => {
    }, 4000);
  }

  ngOnInit() {

  }

  ActivarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.cargando = false
    }, 5000);
  }

  Volver() {
    this.spinner = true;
    setTimeout(() => {
      this.router.navigateByUrl('/home-metre', { replaceUrl: true });
    }, 1000);
  }

  Liberar(idField: string, idUsuario: string){
    this.ActivarSpinner();
    this.authService.asignarMesa(idField, "0");

    //idUsuario
    //LIBERAR PEDIDO
    //LIBERAR CIERRE CUENTA

    setTimeout(() => {
      this.Alerta("Mesa liberada", 'success');
    }, 5500);
  }


}