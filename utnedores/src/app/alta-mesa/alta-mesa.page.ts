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
  capacidad = "";
  selectedIndex = 0;
  file: File;
  categorias: string[] = [
    "Estándar",
    "Discapacitados",
    "VIP"];
  mesaPhoto = "../../assets/table-photo.png";
  spinner = false;
  fotosLleno = false;
  nombreFoto = "";

  constructor(
    private authService: AuthService
  ) { 
    this.Actualizar();
  }

  Actualizar(){
    this.TraerMesas();
    this.AsignarNombreFotos();
  }


  LimpiarFoto(num: number){
    this.mesaPhoto = "../../assets/table-photo.png";
    this.fotosLleno = false;
    this.file = null;
  }

  Caracteres(dato: string){
    var retorno = dato.toString();
    if(dato.length == 1){
      retorno = "0" + retorno;
    }
    return retorno;
  }


  AsignarNombreFotos(){
    var date = new Date();
    this.nombreFoto =  date.getFullYear().toString() + this.Caracteres(date.getMonth().toString()) + this.Caracteres(date.getDate().toString()) + this.Caracteres(date.getHours().toString()) + this.Caracteres(date.getMinutes().toString()) + this.Caracteres(date.getSeconds().toString());
  }


  TraerMesas(){
		this.authService.getTables().subscribe(allTables => {
      this.mesas = allTables;
      this.AsignarNumeroMesa();
		});
	}

  ngOnInit() {
  }


  AsignarImagen(){
    var readerVar = new FileReader();
    readerVar.readAsDataURL(this.file);
    readerVar.onload = (_event) => {
      this.mesaPhoto = (readerVar.result).toString();
    }
  }



  Cargar(event:any):void{
    this.file = event.target.files[0];
    this.AsignarImagen();
    this.fotosLleno = true;
  }

  ImprimirMensaje(mensaje){
    console.log(mensaje);
  } 

  SetCapacidad(value){
    this.capacidad = value;
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

  Fotos(){
    (<HTMLInputElement>document.getElementById('inputFiles')).click();
  }

  SelectChange(event){
    this.selectedIndex = Number(event.detail.value);
  }

  AgregarMesa(){

    if(this.numMesa == "0"){
      //ERROR
      this.TraerMesas();
      this.ImprimirMensaje("Surgio un error! Reintentar");
    }
    else{

      var unaMesa: Mesa = {
        idField: "",
        numMesa: this.numMesa,
        qr: this.myAngularxQrCode,
        capacidad: this.capacidad,
        tipo: this.categorias[this.selectedIndex],
        foto: this.nombreFoto,
        idMozo: "0",
        idUsuario: "0",
        cuenta: "0",
        pedirCuenta: "No"
      };

      this.authService.addTable(unaMesa);
      
      setTimeout(()=>{
        var imagenStorage = "mesas/" + this.nombreFoto;
      this.authService.subirImagenFile(imagenStorage, this.file);
      },3000);
    }
  }
}
