import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { FilterPage } from '../../modals/filter/filter.page';
import { UnitService } from '../../services/unit.service';
import { TagService } from '../../services/tag.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.scss' ],
	providers: [ ProductService, TagService, UnitService ]
})
export class HomePage {
	constructor(
		private modalCtrl: ModalController,
		public productService: ProductService,
		private tagService: TagService,
		private unitService: UnitService
	) {}
	products: Product[] = [];
	noElements = false;

	async ionViewWillEnter() {
		await this.getProducts();
	}
	loading = false;
	async getProducts() {
		this.loading = true;
		const { products } = await this.productService.index(null, this.tag_ids, this.unit_ids);
		this.loading = false;
		this.products = products;
		this.noElements = products.length === 0;
	}

	async refreshProducts(event) {
		await Promise.all([ this.getProducts(), this.unitService.indexAndStore(), this.tagService.indexAndStore() ]);
		event.target.complete();
	}

	unit_ids: number[] = [];
	tag_ids: number[] = [];

	async openFilterModal() {
		const modal = await this.modalCtrl.create({
			component: FilterPage,
			cssClass: 'resize-modal-filter',
			backdropDismiss: false,
			componentProps: {
				unit_ids: this.unit_ids,
				tag_ids: this.tag_ids
			}
		});
		await modal.present();

		const { data } = await modal.onWillDismiss();

		if (data.refresh) {
			this.getProducts();
		}
	}
}
