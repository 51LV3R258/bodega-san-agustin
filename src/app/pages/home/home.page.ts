import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';
import { TagService } from '../../services/tag.service';
import { UnitService } from '../../services/unit.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.scss' ],
	providers: [ ProductService, TagService, UnitService ]
})
export class HomePage {
	constructor(
		public productService: ProductService,
		private tagService: TagService,
		private unitService: UnitService
	) {}
	products: Product[] = [];
	noElements = false;
	async ionViewWillEnter() {
		await this.getProducts();
	}

	async getProducts() {
		const { products } = await this.productService.index();
		this.products = products;
		this.noElements = products.length === 0;
	}

	async refreshProducts(event) {
		// await this.getProducts();
		await Promise.all([ this.getProducts(), this.unitService.indexAndStore(), this.tagService.indexAndStore() ]);
		event.target.complete();
	}
}
