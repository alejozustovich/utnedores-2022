import { Component, OnInit } from '@angular/core';
import { AuthService, Mesa } from '../services/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
})
export class AltaMesaPage implements OnInit {

  mesas: Mesa[];
  numMesa = "0";
  mostrarQr = false;
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    private authService: AuthService
  ) { 
    this.TraerMesas();
  }

  TraerMesas(){
		this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
      this.AsignarNumeroMesa();
		});
	}

  ngOnInit() {
  }

  AsignarNumeroMesa(){
    for(var i = 0 ; i < this.mesas.length ; i++)
			{
				if(Number(this.numMesa) < Number(this.mesas[i].numMesa))
				{
					this.numMesa = this.mesas[i].numMesa;
				}
			}
      this.numMesa = (Number(this.numMesa) + 1).toString();
      this.myAngularxQrCode = "MESA"+this.numMesa;
      this.mostrarQr = true;
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  AgregarMesa(){

    if(this.numMesa == "0"){
      //ERROR
      this.TraerMesas();
    }
    else{
      //TIPO
      //CAPACIDAD
      //FOTO

      //nombreFoto = qrMesa + EXTENSION ARCHIVO;

      var unaMesa: Mesa = {
        idField: "",
        numMesa: this.numMesa,
        qr: this.myAngularxQrCode,
        capacidad: "",
        tipo: "",
        foto: "",
        idMozo: "0",
        idUsuario: "0",
        cuenta: "0",
        pedirCuenta: "No"
      };

      /*this.authService.addTable(unaMesa);
      setTimeout(()=>{
        this.TraerMesas();
      },4000);*/
    }
  }


}
