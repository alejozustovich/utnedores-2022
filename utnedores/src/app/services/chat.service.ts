import { Injectable } from '@angular/core';
import { query, where, Firestore, collection, collectionData, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Mensaje {
	usuario: any;
	mensaje: string;
	fecha: number;
}

export interface Chat {
	numMesa: string;
	idField: string;
	leido: boolean;
	mensajes: Mensaje[];
}

@Injectable({
	providedIn: 'root'
})
export class ChatService {
	constructor(private firestore: Firestore) { }

	cargarChatMesa(ruta: string, num: string): Observable<any> {
		const chatRef = collection(this.firestore, ruta);
		const q = query(chatRef, where('numMesa', '==', num));
		return (collectionData(q, { idField: 'idField' }) as Observable<any>);
	}

	cargarChatLeido(ruta: string, leido: boolean): Observable<any> {
		const chatRef = collection(this.firestore, ruta);
		const q = query(chatRef, where('leido', '==', leido));
		return (collectionData(q, { idField: 'idField' }) as Observable<any>);
	}

	agregarChat(chat: any, ruta: string) {
		const chatRef = collection(this.firestore, ruta);
		return addDoc(chatRef, chat);
	}

	modificarChat(obj: any, ruta: string) {
		const chatRef = doc(this.firestore, ruta);
		return updateDoc(chatRef, obj);
	}
}
