import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQRPage implements OnInit {
  
  mostrarQr = false;
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor() {
    this.myAngularxQrCode = "GENERARQR";
    this.mostrarQr = true;
  }


  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  ModificarQR(texto: string){
    this.myAngularxQrCode = texto;
  }

  ngOnInit() {
  }

}
