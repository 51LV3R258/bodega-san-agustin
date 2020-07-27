import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';
import { ModalController, IonContent, IonInfiniteScroll, MenuController } from '@ionic/angular';
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
	@ViewChild(IonContent, { static: false })
	content: IonContent;
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	constructor(
		private modalCtrl: ModalController,
		public productService: ProductService,
		private tagService: TagService,
		private unitService: UnitService,
		private menu: MenuController
	) {}
	products: Product[] = [];
	noElements = false;
	loading = false;
	async ionViewWillEnter() {
		await this.getProducts(true);
	}

	order_by = 'n';
	async getProducts(refresh?: boolean, event?) {
		this.loading = true;
		const { products } = await this.productService.index(null, this.tag_ids, this.unit_ids, this.order_by, refresh);
		if (refresh) {
			this.products = [];
			this.content.scrollToTop(800);
			this.enableInfiniteScroll();
		}
		this.loading = false;
		if (event != null && products.length === 0) {
			event.target.disabled = true;
			event.target.complete();
			return;
		}
		this.products.push(...products);
		this.noElements = this.products.length === 0;
	}

	async refreshProducts(event) {
		await Promise.all([
			this.getProducts(true),
			this.unitService.indexAndStore(),
			this.tagService.indexAndStore()
		]);
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
				tag_ids: this.tag_ids,
				order_by: this.order_by
			}
		});
		await modal.present();

		const { data } = await modal.onWillDismiss();

		if (data.refresh) {
			this.order_by = data.order_by;
			this.getProducts(true);
		}
	}
	async appendData(event) {
		await this.getProducts(false, event);
		if (event) {
			event.target.complete();
		}
	}

	enableInfiniteScroll() {
		this.infiniteScroll.disabled = false;
	}

	openMenu() {
		this.menu.enable(true, 'first');
		this.menu.open('first');
	}
}
