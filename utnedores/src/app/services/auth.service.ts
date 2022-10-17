import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Auth,	signInWithEmailAndPassword,	createUserWithEmailAndPassword,	signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Local{
	idLocal: string;
	qr: string;
}

export interface Usuario{
	idField: string;
	idUsuario: string;
	nombre: string;
	apellido: string;
	correo: string;
	clave: string;
	dni: string;
	cuil: string;
	foto: string;
	perfil: string;
	tipo: string;
	aprobado: string;
}

export interface ListaEspera{
	idField: string;
	idUsuario: string;
	fecha: string;
	hora: string;
	cantPersonas: string;
}

export interface Mesa{
	idField: string;
	numMesa: string;
	qr: string;
	capacidad: string;
	tipo: string;
	foto: string;
	idMozo: string;
	idUsuario: string;
	cuenta: string;
	pedirCuenta: string;
}

export interface Producto{
	idField: string;
	idProducto: string;
	categoria: string;
	producto: string;
	tamanio: string;
	descripcion: string;
	tiempoElaboracion: string;
	foto1: string;
	foto2: string;
	foto3: string;
	precio: string;
	qr: string;
}

export interface Pedido{
	idField: string;
	numMesa: string;
	idProducto: string;
	cantidad: string;
	demora: string;
	precio: string;
	fecha: string;
	hora: string;
	estado: string;
}

export interface Propina{
	idField: string;
	idUsuario: string;
	valor: string;
}

export interface ReservaNoConfirmada{
	idField: string;
	idUsuario: string;
	cantPersonas: string;
	hora: string;
	fecha: string;
}

export interface ReservaAsignada{
	idField: string;
	numMesa: string;
	idUsuario: string;
	fecha: string;
	hora: string;
}

export interface EncuestaCliente{
	atencion: string;
	ambiente: string;
	rapidez: string;
	precioCalidad: string;
	limpieza: string;
	foto1: string;
	foto2: string;
	foto3: string;
}

export interface EncuestaEmpleado{
	atencion: string;
	orden: string;
	limpieza: string;
	comodidad: string;
	climaLaboral: string;
	foto1: string;
}

export interface EncuestaSupervisor{
	respetuoso: string;
	amable: string;
	simpatia: string;
	limpieza: string;
	recomendacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	constructor(
		private auth: Auth,
		private firestore: Firestore
	) {

	}

	addUser(user: Usuario)
	{
		const userRef = collection(this.firestore, 'users');
		return addDoc(userRef, user);
	}

	getUsers(): Observable<Usuario[]>
	{
		const userRef = collection(this.firestore, 'users');
		return collectionData(userRef) as Observable<Usuario[]>;
	}

  	async register({ email, password }) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

	logout() {
		return signOut(this.auth);
	}
  
}
