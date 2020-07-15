import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class GeneralService {
	constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController) {}

	async presentToast(message: string) {
		const toast = await this.toastCtrl.create({
			message: message,
			duration: 2000
		});
		toast.present();
	}
	async presentLoadingInfinite() {
		const loading = await this.loadingCtrl.create({
			message: 'Espere...',
			duration: 8000 //Cerrar automáticamente si no se cierra
		});
		await loading.present();
	}

	async dismissLoading() {
		await this.loadingCtrl.dismiss();
	}

	async presentToastInfinite(message: string) {
		const toast = await this.toastCtrl.create({
			message: message,
			duration: 8000 //Cerrar automáticamente si no se cierra
		});
		toast.present();
	}

	async dismissToast() {
		await this.toastCtrl.dismiss();
	}
}
