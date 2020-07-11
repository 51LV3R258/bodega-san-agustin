import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { UnitService } from './services/unit.service';
import { TagService } from './services/tag.service';
const { SplashScreen, App } = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: [ 'app.component.scss' ],
	providers: [ UnitService, TagService ]
})
export class AppComponent {
	@ViewChild(IonRouterOutlet, { static: false })
	routerOutlet: IonRouterOutlet;
	constructor(
		private router: Router,
		private platform: Platform,
		private statusBar: StatusBar,
		private alertCtrl: AlertController,
		private unitService: UnitService,
		private tagService: TagService
	) {
		this.initializeApp();
	}
	async presentAlertConfirm() {
		const alert = await this.alertCtrl.create({
			header: 'Cerrar',
			message: '¿Esta seguro que desea salir?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Confirmar',
					handler: () => {
						App.exitApp();
					}
				}
			]
		});
		await alert.present();
	}
	async initializeApp() {
		this.platform.ready().then(async () => {
			SplashScreen.hide().catch((error) => {
				console.warn(error);
			});
			if ((this.platform.is('android') || this.platform.is('ios')) && this.platform.is('hybrid')) {
				this.statusBar.styleDefault();
			}
			this.platform.backButton.subscribeWithPriority(0, async () => {
				if (this.router.url === '/home') {
					this.presentAlertConfirm();
				} else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
					// console.log(this.router.url);
					this.routerOutlet.pop();
				} else {
					this.presentAlertConfirm();
				}
			});
		});
		await this.unitService.indexAndStore();
		await this.tagService.indexAndStore();
	}
}
