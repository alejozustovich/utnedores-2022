import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, Mensaje, Usuario } from '../services/auth.service';
import { Chat, ChatService } from '../services/chat.service';
import { DataUsuarioService } from '../services/data-usuario.service';
import { UtilidadesService } from '../services/utilidades.service';
import { PushNotificationService } from '../services/push-notification.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  volumenOn = true;
  chat: Chat = { numMesa: '0', idField: '0', leido: false, mensajes: [] };
  numMesa: string;
  spinner: boolean = true;
  formMsj: FormGroup;
  subChat: Subscription;
  subCajaMsj: Subscription;
  usuarioActual: Usuario;
  idUsuarioPedido: string;
  users: Usuario[];
  flagToken = true;

  @ViewChildren('cajaMsj') cajaMsj: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private dataUsuarioService: DataUsuarioService,
    private cdref: ChangeDetectorRef,
    private utilidades: UtilidadesService,
    private router: Router,
    private pnService: PushNotificationService
  ) {
    this.spinner = true;
    setTimeout(()=>{
      this.spinner = false;
    },5000);
    this.Sonido();
    this.TraerUsuarios();
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

  TraerUsuarios(){
    this.authService.getUsers().subscribe(allUsers => {
      this.users = allUsers;
      this.spinner = false;
    });
  }

  ngOnInit(): void {
    this.numMesa = localStorage.getItem('numeroMesa');
    this.formMsj = this.fb.group(
      {
        mensaje: ['', [Validators.maxLength(30)]]
      }
    )
    this.authService.obtenerAuth().onAuthStateChanged(user => {
      this.authService.getUser(user.email).then((user: Usuario) => {
        this.usuarioActual = user;
        this.subChat = this.chatService.cargarChatMesa('chats', this.numMesa).subscribe((chat: Chat[]) => {
          if (chat[0] != undefined) {
            this.chat = chat[0];
            console.log(this.chat);
          }
          this.spinner = false;
        });
      });
    })
  }

  volver(){
    if(this.usuarioActual.tipo == "Mozo"){
      this.router.navigateByUrl('/home-mozo', { replaceUrl: true });
    }else{
      this.router.navigateByUrl('/home-cliente-mesa', { replaceUrl: true });
    }
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
    var tokens = [""];
    var flagArrayToken = true;

    if(this.flagToken){
      this.users.forEach(user => {
        if(user.tipo.includes("Mozo")){
          if(user.token != ""){
            if(flagArrayToken){
              flagArrayToken = false;
              tokens[0] = user.token;
            }else{
              tokens.push(user.token);
            }
          }
        }
      }); 
    }

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
    if (this.chat.numMesa == "0") {
      const chat = {
        numMesa: this.numMesa,
        leido: false,
        mensajes: [mensaje]
      }
      this.chatService.agregarChat(chat, 'chats')
    } else {
      let flag = false;
      if (this.usuarioActual.tipo == "Mozo") {
        flag = true;
      }else{
        if(this.flagToken){
          this.flagToken = false;
          if(!flagArrayToken){
            this.pnService.sendPush(tokens, "Consulta Cliente", "Chat Pendiente");
          }
        }
      }
      this.chat.mensajes.push(mensaje);
      const obj = { leido: flag, mensajes: this.chat.mensajes }
      this.chatService.modificarChat(obj, `chats/${this.chat.idField}`)
    }
    this.formMsj.reset();
  }
}