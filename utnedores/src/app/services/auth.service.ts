import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Auth,	signInWithEmailAndPassword,	createUserWithEmailAndPassword,	signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteObject, listAll, getDownloadURL, uploadString } from '@angular/fire/storage';


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
		return collectionData(userRef, {idField: 'idField'}) as Observable<Usuario[]>;
	}


	subirImagenBase64(nombreImagen, base64Image){
		const storage = getStorage();
		const storageRef = ref(storage, nombreImagen);
		uploadString(storageRef, base64Image, 'data_url').then((snapshot) =>{
		  
		});
	}

	subirImagenFile(nombreImagen, file){
		const storage = getStorage();
		const storageRef = ref(storage, nombreImagen);
		uploadBytes(storageRef, file).then((response) => {
		});
	}


	addTable(mesa: Mesa)
	{
		const tableRef = collection(this.firestore, 'mesas');
		return addDoc(tableRef, mesa);
	}

	getTables(): Observable<Mesa[]>
	{
		const mesaRef = collection(this.firestore, 'mesas');
		return collectionData(mesaRef, {idField: 'idField'}) as Observable<Mesa[]>;
	}


	addProduct(producto: Producto)
	{
		const productRef = collection(this.firestore, 'productos');
		return addDoc(productRef, producto);
	}

	getProducts(): Observable<Producto[]>
	{
		const productRef = collection(this.firestore, 'productos');
		return collectionData(productRef, {idField: 'idField'}) as Observable<Producto[]>;
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
