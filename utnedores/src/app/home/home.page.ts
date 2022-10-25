import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  volumenOn = true;
  volumenOff = false;
  spinner = false;
  perfil = "Dueño"; //Cambia a Supervisor dependiendo el caso.

  constructor() { }

  ngOnInit() { }

  ActivarDesactivarSonido() {
    if(this.volumenOn) {
      this.volumenOn = false;
      this.volumenOff = true;
    } else {
      this.volumenOn = true;
      this.volumenOff = false;
    }
  }

}

