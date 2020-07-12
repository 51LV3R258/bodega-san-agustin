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
			duration: 2500
		});
		toast.present();
  }

	loading: any;
	async presentLoadingInfinite() {
		this.loading = await this.loadingCtrl.create({
			message: 'Espere...'
		});
		await this.loading.present();
	}
}
