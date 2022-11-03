import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, Mensaje, Usuario } from '../services/auth.service';
import { DataUsuarioService } from '../services/data-usuario.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  
  volumenOn = true;
  chat: Mensaje[];
  formMsj: FormGroup;
  subChat: Subscription;
  subCajaMsj: Subscription;
  usuarioActual: Usuario;
  @ViewChildren('cajaMsj') cajaMsj: QueryList<ElementRef>;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private dataUsuarioService: DataUsuarioService, 
    private cdref: ChangeDetectorRef,
    private utilidades: UtilidadesService
    )
    { 
      this.Sonido();
    }

    Sonido(){
      try {
        var sonido = localStorage.getItem('sonido');
        if(sonido != null){
          if(sonido.includes("No")){
            this.volumenOn = false;
          }
        }
      } catch (error) {
        
      }
    }

  ngOnInit(): void {
    this.formMsj = this.fb.group(
      {
        mensaje: ['', [Validators.maxLength(30)]]
      }
    )
    this.authService.obtenerAuth().onAuthStateChanged(user => {
      this.authService.getUser(user.email).then((user: Usuario) => {
        this.usuarioActual = user;
        this.subChat = this.authService.cargarMensajes('chat-mesa1').subscribe((mensajes: Mensaje[]) => {
          this.chat = mensajes;
        });
      });
    })
    // this.dataUsuarioService.usuario$.subscribe((usuario: Usuario) => {
    //   this.usuarioActual = usuario;
    // })
  }

  get mensaje() {
    return this.formMsj.get('mensaje');
  }

  ngAfterViewInit(): void {
    this.subCajaMsj = this.cajaMsj.changes
      .subscribe(() => {
        this.cajaMsj.forEach(el => {
          if (el.nativeElement.id == this.usuarioActual.idUsuario) {
            el.nativeElement.classList.add('animacion-derecha');
          } else {
            el.nativeElement.classList.add('animacion-izquierda');
          }
        })
        this.subCajaMsj.unsubscribe();
      });
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    this.subChat.unsubscribe();
  }

  bgMsjOpuesto(msj: Mensaje) {
    if (this.usuarioActual.idUsuario != msj.usuario.id) {
      if(msj.usuario.tipo == 'Mozo'){
        return 'caja-msj-mozo';
      }else{
        return 'caja-msj-cliente';
      }
    } 
  }

  enviarMensaje() {
    const textoMensaje = this.formMsj.value.mensaje
    const usuario = {
      id: this.usuarioActual.idUsuario, nombre: this.usuarioActual.nombre,
      apellido: this.usuarioActual.apellido, tipo: this.usuarioActual.tipo
    };
    const mensaje = {
      usuario: usuario,
      mensaje: textoMensaje,
      fecha: new Date().getTime()
    }
    this.authService.agregarMensaje(mensaje, 'chat-mesa1');
    this.formMsj.reset();
  }

}
