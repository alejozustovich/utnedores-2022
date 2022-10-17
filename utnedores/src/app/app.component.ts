import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public router: Router
  )
  {
    SplashScreen.hide();
    this.initializeApp();
    this.Inicializar();
  }

  initializeApp(){
    SplashScreen.hide();
    this.platform.ready().then(()=>{
      this.router.navigateByUrl('splash');
    });
  }
  
  Inicializar()
  {
    this.platform.ready().then(()=>{
      //CARGAR AUDIOS
    });
  }
}
