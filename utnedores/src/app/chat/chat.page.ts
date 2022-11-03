import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, Mensaje, Usuario } from '../services/auth.service';
import { Chat, ChatService } from '../services/chat.service';
import { DataUsuarioService } from '../services/data-usuario.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  volumenOn = true;
  chat: Chat = {idUsuario: '0', idField: '0', mensajes: []};
  spinner: boolean = true;
  formMsj: FormGroup;
  subChat: Subscription;
  subCajaMsj: Subscription;
  usuarioActual: Usuario;
  idUsuarioPedido: string;
  @ViewChildren('cajaMsj') cajaMsj: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private dataUsuarioService: DataUsuarioService,
    private cdref: ChangeDetectorRef,
    private utilidades: UtilidadesService
  ) {
    this.Sonido();
  }

  Sonido() {
    try {
      var sonido = localStorage.getItem('sonido');
      if (sonido != null) {
        if (sonido.includes("No")) {
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
    // this.dataUsuarioService.idUsuarioPedido$.subscribe(id => {
    //   this.idUsuarioPedido = id;
    // })
    this.authService.obtenerAuth().onAuthStateChanged(user => {
      this.authService.getUser(user.email).then((user: Usuario) => {
        this.usuarioActual = user;
        //en el 1 iria this.idUsuarioPedido, que se lo paso al servicio cada vez que entro al chat
        this.subChat = this.chatService.cargarChat('chats', '1').subscribe((chat: Chat) => {
          if(chat[0] != undefined){
            this.chat = chat[0];
          }
          this.spinner = false;
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
      if (msj.usuario.tipo == 'Mozo') {
        return 'caja-msj-mozo';
      } else {
        return 'caja-msj-cliente';
      }
    }
  }

  enviarMensaje() {
    const textoMensaje = this.formMsj.value.mensaje;
    const usuario = {
      id: this.usuarioActual.idUsuario, nombre: this.usuarioActual.nombre,
      apellido: this.usuarioActual.apellido, tipo: this.usuarioActual.tipo
    };
    const mensaje = {
      usuario: usuario,
      mensaje: textoMensaje,
      fecha: new Date().getTime()
    }
    if (this.chat.mensajes.length == 0) {
      const chat = {
        idUsuario: '1',
        mensajes: [mensaje]
      }
      this.chatService.agregarChat(chat, 'chats')
    } else {
      this.chat.mensajes.push(mensaje);
      this.chatService.modificarChat(this.chat.mensajes, `chats/${this.chat.idField}`)
    }
    this.formMsj.reset();
  }

}
