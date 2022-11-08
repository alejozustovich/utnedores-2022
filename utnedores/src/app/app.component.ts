import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilidadesService } from './services/utilidades.service';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    public router: Router,
    private utilidades: UtilidadesService,
    private pnService: PushNotificationService
  ) {
    this.initializeApp();
    this.Inicializar();
    //this.pnService.getUser();
  }

  public initializeApp() 
  {
    this.platform.ready().then(() => {
      setTimeout(() => {
        //SplashScreen.hide();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }, 1000);
    });
  }

  Inicializar()
  {
    this.platform.ready().then(()=>{
      this.utilidades.PreloadAudio();  
    });
  }
}
