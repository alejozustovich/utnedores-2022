import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import {Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
//import { LocalNotifications } from '@capacitor/local-notifications';
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationService {

  private user;

  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private http: HttpClient
  ) { }

  sendPush(tokens){
    this.sendPushNotifications({
      registration_ids: tokens,
      notification: {
        title: 'Un Titulo',
        body: 'Un Body'
      },
      data: {
        id: 1,
        nombre: 'Daniel'
      },
    })
    .subscribe((data) => {
      console.log(data);
    });  
  }

  async inicializar(): Promise<void>{
    this.addListeners();
    if(this.platform.is('capacitor') && this.user.token === ''){
      const result = await PushNotifications.requestPermissions();
      if(result.receive === 'granted'){
        await PushNotifications.register();
      }
    }
  }

  getUser(idField: string): void {
    var ruta = 'users/' + idField;
    const aux = doc(this.firestore, ruta);
    docData(aux, {idField: 'id'}).subscribe(async (user) => {
      this.user = user;
      this.inicializar();
    });
  }

  sendPushNotifications(req): Observable<any>{
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        Authorization: `key=${environment.fcmServerKey}`,
        'Content-Type': 'application/json'
      },
    })
  }

  eliminarToken(idField: string) {
		const userRef = doc(this.firestore, `users/${idField}`);
		return updateDoc(userRef, { token: "" });
	}

  private async addListeners(): Promise<void> {
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('Registration token: ', token.value);
        const aux = doc(this.firestore, `users/${this.user.id}`);
        await updateDoc(aux, {
          token: token.value
        });
      }
    );

    await PushNotifications.addListener('registrationError', (err) => {
      console.log('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        LocalNotifications.schedule({
          notification: [
            {
              tittle: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data
              }
            }
          ]
        });
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push Notification Action Performed: ',
        notification.actionId,
        notification.notification
        );
      }
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('Local Notification Action Performed: ', notificationAction);
      }
    );
  }
}
