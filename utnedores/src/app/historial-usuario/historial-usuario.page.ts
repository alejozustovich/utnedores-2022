import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService, EncuestaSupervisor } from '../services/auth.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.page.html',
  styleUrls: ['./historial-usuario.page.scss'],
})
export class HistorialUsuarioPage implements OnInit {

  idUsuarioEncuesta = "0";
  encuestas: EncuestaSupervisor[];
  spinner: boolean = false;

  constructor(
    private toastController : ToastController,
    private authService: AuthService,
    private router: Router,
    private utilidades: UtilidadesService
  ) {
    this.idUsuarioEncuesta = localStorage.getItem('idUsuarioEncuesta');
  }

  ngOnInit() {
  }

  TraerEncuestasSupervisor() {
    this.authService.traerEncuestaSupervisor().subscribe(listaencuestas => {
      this.encuestas = listaencuestas;
    });
  }

  Volver() {
    this.spinner = true;
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }


}
