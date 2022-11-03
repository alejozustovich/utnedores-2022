import { Injectable } from '@angular/core';
import { query, where, Firestore, collection, collectionData, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Mensaje {
	usuario: any;
	mensaje: string;
	fecha: number;
}

export interface Chat{
  idUsuario: string;
  idField: string;
  mensajes: Mensaje[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore) { }

  cargarChat(ruta: string, id: string): Observable<any> {
		const chatRef = collection(this.firestore, ruta);
		const q = query(chatRef, where('idUsuario', '==', id));
		return (collectionData(q, {idField: 'idField'}) as Observable<any>);
	}

	agregarChat(chat: any, ruta: string) {
    console.log(chat);
		const chatRef = collection(this.firestore, ruta);
		return addDoc(chatRef, chat);
	}

  modificarChat(mensajes: any, ruta: string) {
		const chatRef = doc(this.firestore, ruta);
		return updateDoc(chatRef, {mensajes: mensajes});
	}
}
