import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Router } from '@angular/router';
import { UnitService } from './services/unit.service';
import { TagService } from './services/tag.service';
const { SplashScreen, App, StatusBar } = Plugins;

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
			this.checkDarkMode();
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
		await Promise.all([ this.unitService.indexAndStore(), this.tagService.indexAndStore() ]);
	}

	checkDarkMode() {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		let dark = false;
		if (window.navigator.userAgent.includes('AndroidDarkMode')) {
			dark = true;
		} else {
			dark = prefersDark.matches;
		}
		if (dark) {
			document.body.classList.add('dark');
			StatusBar.setBackgroundColor({
				color: '#000000'
			}).catch((error) => {
				// console.warn(error);
			});
		} else {
			StatusBar.setBackgroundColor({
				color: '#ffffff'
			}).catch((error) => {
				// console.warn(error);
			});
		}

		StatusBar.setStyle({
			style: dark ? StatusBarStyle.Dark : StatusBarStyle.Light
		}).catch((error) => {
			// console.warn(error);
		});
	}
}
