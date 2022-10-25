import { Injectable } from '@angular/core';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(
    private nativeAudio: NativeAudio
    ) { 

  }

  async PreloadAudio()
  {
    try {
      this.nativeAudio.preloadComplex('uniqueId1', 'assets/sonidos/entrada.mp3', 1, 1, 0);
      this.nativeAudio.preloadComplex('uniqueId2', 'assets/sonidos/salida.mp3', 1, 1, 0);
    } catch (error) {
      
    }
  }

  async PlayLogin()
  {
      this.nativeAudio.play('uniqueId1');
  }

  async PlayLogout()
  {
      this.nativeAudio.play('uniqueId2');
  }
}
