import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../interfaces/interfaces';
import { GeneralService } from '../../services/general.service';
import { ProductService } from '../../services/product.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
	selector: 'products-component',
	templateUrl: './products.component.html',
	styleUrls: [ './products.component.scss' ],
	providers: [ GeneralService, ProductService ]
})
export class ProductsComponent implements OnInit {
	@Input() noElements: boolean;
	@Input() products: Product[];
	@Input() noElementsDetail : string;
	constructor(
		private generalService: GeneralService,
		private productService: ProductService,
		private router: Router
	) {}

	ngOnInit() {}

	async toEditProduct(product_id) {
		await this.generalService.presentToastInfinite('Cargando producto');
		const res = await this.productService.show(product_id);
		await this.generalService.dismissToast();

		if (res.ok) {
			let navigationExtras: NavigationExtras = {
				state: {
					product: res.product
				}
			};

			this.router.navigate([ '/product' ], navigationExtras);
		} else {
			this.generalService.presentToast(res.error);
		}
	}
}
