import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {

  volumenOn = true;
  volumenOff = false;
  esRegistrado = true;
  spinner = false;

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
