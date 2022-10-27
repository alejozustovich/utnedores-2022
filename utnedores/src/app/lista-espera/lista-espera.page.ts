import { Component, OnInit } from '@angular/core';
import { AuthService, Espera, Usuario } from '../services/auth.service';
import { getDownloadURL } from '@angular/fire/storage';
import { getStorage, ref } from "firebase/storage";

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})


export class ListaEsperaPage implements OnInit {

  listado: Espera[];

  constructor(
    private authService: AuthService
  ) { 
    this.TraerListaEspera();
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

    });
    setTimeout(() => {
      console.log(this.listado);
    }, 3000);
  }

  ngOnInit() {

  }

}
