import { Component } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { ProductService } from '../../services/product.service';
import { UnitService } from '../../services/unit.service';
import { ModalController, AlertController, IonLabel, LoadingController, ToastController } from '@ionic/angular';
import { NewProduct, SalePrice, Unit, Tag } from '../../interfaces/interfaces';
import { SelectTagsPage } from '../../modals/select-tags/select-tags.page';
import { SelectSalePricesPage } from '../../modals/select-sale-prices/select-sale-prices.page';
import { Router } from '@angular/router';

@Component({
	selector: 'app-product',
	templateUrl: './product.page.html',
	styleUrls: [ './product.page.scss' ],
	providers: [ TagService, ProductService, UnitService ]
})
export class ProductPage {
	prices: SalePrice[] = [];
	product: NewProduct;
	units: Unit[];
	tags: Tag[];

	clearData() {
		this.prices = [];
		this.product = {
			nombre: '',
			imagen: null,
			other_names: [],
			sale_prices: this.prices,
			tag_ids: [],

			// Precio de compra
			purchase_price: null,
			unit_id: null
		};
	}

	constructor(
		private tagService: TagService,
		private productService: ProductService,
		private unitService: UnitService,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		public loadingController: LoadingController,
		private router: Router,
		private toastCtrl: ToastController
	) {
		this.clearData();
		this.unitService.load();
		this.tagService.load();
	}

	ionViewWillEnter() {
		this.unitService.units$.subscribe((units) => {
			this.units = units;
		});
		this.tagService.tags$.subscribe((tags) => {
			this.tags = tags;
		});
	}

	async openModalSelectSalePrices() {
		const modal = await this.modalCtrl.create({
			component: SelectSalePricesPage,
			cssClass: 'resize-modal',
			componentProps: {
				units: this.units,
				product: this.product
			}
		});
		await modal.present();
	}

	async openModalSelectTags() {
		const modal = await this.modalCtrl.create({
			component: SelectTagsPage,
			cssClass: 'resize-modal',
			componentProps: {
				tags: this.tags,
				product: this.product
			}
		});
		await modal.present();
	}

	async openAlertOtherNames() {
		const alert = await this.alertCtrl.create({
			header: 'Agregar otro nombre',
			message: 'Escribe otro nombre con el que buscar el producto',
			inputs: [
				{
					name: 'otro',
					type: 'text'
				}
			],
			buttons: [
				{
					text: 'Cerrar',
					role: 'cancel'
				},
				{
					text: 'Guardar',
					handler: (data) => {
						if (data.otro) {
							if (!this.verifyIsInArrayOtherName(data.otro)) {
								this.product.other_names.push(data.otro);
							}
						}
					}
				}
			]
		});
		await alert.present();
	}

	verifyIsInArrayOtherName(other_name: string) {
		return this.product.other_names.find((n) => n.toLowerCase() === other_name.toLowerCase());
	}

	removeOtherName(i: number) {
		this.product.other_names.splice(i, 1);
	}

	removeTag(tag: Tag) {
		this.product.tag_ids = this.product.tag_ids.filter((id) => id !== tag.id);
		tag.isChecked = false;
	}

	colorize(ionLabel: IonLabel, focus: boolean) {
		if (focus) {
			ionLabel.color = 'primary';
		} else {
			ionLabel.color = 'dark';
		}
	}

	customPopoverOptions: any = {
		subHeader: 'Selecciona las unidades de costo'
	};

	compareWithFn = (o1: number, o2: number) => {
		this.product.unit_id = o2;
		return o1 === o2;
	};
	compareWith = this.compareWithFn;

	priceDetail(unit_id: number) {
		const sale_price = this.product.sale_prices.find((sale_price) => sale_price.unit_id === unit_id);
		if (sale_price) {
			return sale_price.detalle;
		}
		return null;
	}

	removeUnit(unit: Unit) {
		this.product.sale_prices = this.product.sale_prices.filter((sale_price) => sale_price.unit_id !== unit.id);
		unit.isChecked = false;
	}

	loading: any;
	async presentLoadingInfinite() {
		this.loading = await this.loadingController.create({
			message: 'Espere...'
		});
		await this.loading.present();
	}
	async logForm() {
		await this.presentLoadingInfinite();
		const res = await this.productService.store(this.product);

		await this.loading.dismiss();

		if (res.ok) {
			this.router.navigateByUrl('/home');
			this.presentToast(res.message);
		} else {
			this.presentToast(res.error);
		}
	}

	async presentToast(message: string) {
		const toast = await this.toastCtrl.create({
			message: message,
			duration: 2500
		});
		toast.present();
	}
}
