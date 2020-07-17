import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';

@Component({
	selector: 'app-search-product',
	templateUrl: './search-product.page.html',
	styleUrls: [ './search-product.page.scss' ],
	providers: [ ProductService ]
})
export class SearchProductPage implements OnInit {
	@ViewChild(IonContent, { static: false })
	content: IonContent;
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	constructor(private router: Router, private productService: ProductService) {}
	products: Product[] = [];
	noElements = false;
	loading = false;
	query: string = null;
	ngOnInit() {}

	exit() {
		this.router.navigate([ '/home' ]);
	}

	async searchProduct(event?) {
		let query: string = null;
		if (event) {
			query = event.target.value.toString();
		} else {
			query = this.query;
		}
		if (query) {
			this.loading = true;
			const { products } = await this.productService.search(query, true);
			this.products = [];
			this.content.scrollToTop(800);
			this.infiniteScroll.disabled = false;
			this.loading = false;
			this.products.push(...products);
			this.noElements = this.products.length === 0;
		} else {
			this.loading = false;
			this.noElements = false;
			this.products = [];
			this.infiniteScroll.disabled = true;
		}
	}

	async appendData(event) {
		const { products } = await this.productService.search(this.query);
		if (products.length === 0) {
			event.target.disabled = true;
			event.target.complete();
			return;
		}
		this.products.push(...products);
		if (event) {
			event.target.complete();
		}
	}
}
