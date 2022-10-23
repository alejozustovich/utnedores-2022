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

  constructor() { }

  ngOnInit() {
  }

}
