import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Espera, Usuario, Mesa } from '../services/auth.service';
import { getDownloadURL } from '@angular/fire/storage';
import { getStorage, ref } from "firebase/storage";

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})


export class ListaEsperaPage implements OnInit {

  listado: Espera[];
  mesas: Mesa [];
  hayEnEspera = true;
  spinner = false;
  isModalOpen = false;

  idFieldEliminar = "0";
  cantidadComensales = 0;
  cantidadSeleccionada = 0;
  
  constructor(
    public router: Router ,
    private authService: AuthService
  ) { 
    this.TraerListaEspera();
    this.TraerMesas();
    this.ValidarEnEspera();
    this.ActivarSpinner();
  }

  TraerListaEspera(){
    this.authService.listaEspera().subscribe(lista => {
        this.listado = lista;

        this.listado.forEach(u => {
          const storage = getStorage();
          const storageRef = ref(storage, ("usuarios/" + u.foto));

          getDownloadURL(storageRef).then((response) => {
            u.foto = response;
          });
        });

        for(var i = 0 ; i < this.listado.length - 1; i++){
          for(var k = i + 1 ; k < this.listado.length; k++){
            if((Number(this.listado[i].idEspera)) > (Number(this.listado[k].idEspera))){
              var esperaAux = this.listado[i];
              this.listado[i] = this.listado[k];
              this.listado[k] = esperaAux;
            }
          }
        }

    });
    setTimeout(() => {
      console.log(this.listado);
    }, 4000);
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

    });
    setTimeout(() => {
      console.log(this.mesas);
    }, 4000);
  }

  ngOnInit() {

  }

  ActivarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 5000);
  }

  ValidarEnEspera() {
    setTimeout(() => {
      this.listado.length > 0 ? this.hayEnEspera = true : this.hayEnEspera = false;
      console.log(this.hayEnEspera);
    }, 4500);
  }

  Volver() {
    this.router.navigateByUrl('home-metre');
  }

  setOpen(cantPersonas: string, idField: string) {
    this.cantidadComensales = Number(cantPersonas);
    this.idFieldEliminar = idField;
    this.isModalOpen = true;


  }

  SeleccionarMesa() { 

  }

}
