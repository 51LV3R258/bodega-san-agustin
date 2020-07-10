import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.scss' ],
	providers: [ ProductService ]
})
export class HomePage {
	constructor(public productService: ProductService) {}
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
}
