import { Component, ViewChild } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { ProductService } from '../../services/product.service';
import { UnitService } from '../../services/unit.service';
import { ModalController, AlertController, IonLabel, IonSelect } from '@ionic/angular';
import { NewProduct, SalePrice, Unit, Tag, Product } from '../../interfaces/interfaces';
import { SelectTagsPage } from '../../modals/select-tags/select-tags.page';
import { SelectSalePricesPage } from '../../modals/select-sale-prices/select-sale-prices.page';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../services/general.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.page.html',
	styleUrls: [ './product.page.scss' ],
	providers: [ TagService, ProductService, UnitService, GeneralService ]
})
export class ProductPage {
	@ViewChild('select_unit', { static: true })
	ionSelect: IonSelect;
	prices: SalePrice[] = [];
	product: NewProduct;
	units: Unit[];
	tags: Tag[];
	isWillUpdate = false;
	product_id = null;

	storeProduct() {
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
		private router: Router,
		private generalService: GeneralService,
		private route: ActivatedRoute
	) {
		this.storeProduct();
		this.unitService.load();
		this.tagService.load();
		this.route.queryParams.subscribe(async () => {
			if (this.router.getCurrentNavigation().extras.state) {
				const { product } = this.router.getCurrentNavigation().extras.state;
				this.isWillUpdate = true;
				this.updateProduct(product);
			}
		});
	}

	updateProduct(productToUpdate: Product) {
		this.product_id = productToUpdate.id;

		let unit_id = null;
		if (productToUpdate.unit) {
			unit_id = productToUpdate.unit.id;
		}

		this.product = {
			nombre: productToUpdate.nombre,
			imagen: productToUpdate.imagen,
			other_names: productToUpdate.other_names,
			sale_prices: productToUpdate.sale_prices.map((sale_prices) => {
				return {
					unit_id: sale_prices.unit.id,
					detalle: sale_prices.detalle
				};
			}),
			tag_ids: productToUpdate.tags.map((tag) => tag.id),

			purchase_price: productToUpdate.purchase_price,
			unit_id: unit_id
		};
	}

	ionViewWillEnter() {
		this.unitService.units$.subscribe((units) => {
			this.units = units;
			if (this.isWillUpdate) {
				this.units.forEach((unit) => {
					unit.isChecked = this.product.sale_prices.some((sale_price) => sale_price.unit_id === unit.id);
				});
				if (this.units.length > 0) {
					this.ionSelect.value = this.product.unit_id;
				}
			}
		});
		this.tagService.tags$.subscribe((tags) => {
			this.tags = tags;
			if (this.isWillUpdate) {
				this.tags.forEach((tag) => {
					tag.isChecked = this.product.tag_ids.some((tag_id) => tag_id === tag.id);
				});
			}
		});
	}

	ionViewDidLeave() {
		this.unitService.units$.unsubscribe();
		this.tagService.tags$.unsubscribe();
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

	async submitForm() {
		await this.generalService.presentLoadingInfinite();

		let res: any;
		if (this.isWillUpdate) {
			res = await this.productService.update(this.product, this.product_id);
		} else {
			res = await this.productService.store(this.product);
		}

		await this.generalService.dismissLoading();

		if (res.ok) {
			this.router.navigateByUrl('/home');
			this.generalService.presentToast(res.message);
		} else {
			this.generalService.presentToast(res.error);
		}
	}

	async presentAlertConfirmDelete() {
		const alert = await this.alertCtrl.create({
			header: 'Eliminar producto',
			message: `¿Esta seguro que desea borrar el producto ${this.product.nombre}?`,
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Confirmar',
					handler: async () => {
						await this.generalService.presentLoadingInfinite();
						const res = await this.productService.delete(this.product_id);

						await this.generalService.dismissLoading();

						if (res.ok) {
							this.router.navigateByUrl('/home');
							this.generalService.presentToast(res.message);
						} else {
							this.generalService.presentToast(res.error);
						}
					}
				}
			]
		});
		await alert.present();
	}

	toggleUnit(event: CustomEvent) {
		this.product.unit_id = event.detail.value;
	}
}
