import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { UtilidadesService } from './services/utilidades.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public splash: boolean = false;

  constructor(
    private platform: Platform,
    public router: Router,
    private utilidades: UtilidadesService
  ) {
    SplashScreen.hide();
    this.initializeApp();
    this.Inicializar();
  }

  initializeApp() {
    SplashScreen.hide();
    // this.router.navigateByUrl('login');
    this.splash = false;
    this.platform.ready().then(() => {
      if (this.splash) {
        setTimeout(() => {
          this.splash = false;
        }, 6000);
      }
    });
  }

  Inicializar()
  {
    this.platform.ready().then(()=>{
      this.utilidades.PreloadAudio();  
    });
  }
}
