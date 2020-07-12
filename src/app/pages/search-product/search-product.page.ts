import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
	selector: 'app-search-product',
	templateUrl: './search-product.page.html',
	styleUrls: [ './search-product.page.scss' ]
})
export class SearchProductPage implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {}

	exit() {
		this.router.navigate(['/home']);
	}
}
