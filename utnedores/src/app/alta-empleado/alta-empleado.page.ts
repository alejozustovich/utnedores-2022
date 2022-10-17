import { Component, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit {

  constructor(
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

}
