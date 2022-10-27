import { Component, OnInit } from '@angular/core';
import { AuthService, ListaEspera } from '../services/auth.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  listado: ListaEspera[];

  constructor(
    private authService: AuthService
  ) { }

  TraerListaEspera(){
    this.authService.listaEspera().subscribe(lista => {
        this.listado = lista;
    });
    setTimeout(() => {
      console.log(this.listado);
    }, 3000);
  }

  ngOnInit() {

  }

}
