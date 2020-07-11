import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { SelectTagsPage } from '../../modals/select-tags/select-tags.page';
import { SelectTagsPageModule } from '../../modals/select-tags/select-tags.module';
import { SelectSalePricesPage } from '../../modals/select-sale-prices/select-sale-prices.page';
import { SelectSalePricesPageModule } from '../../modals/select-sale-prices/select-sale-prices.module';

@NgModule({
	entryComponents: [ SelectSalePricesPage, SelectTagsPage ],
	imports: [
		SelectSalePricesPageModule,
		SelectTagsPageModule,
		CommonModule,
		FormsModule,
		IonicModule,
		ProductPageRoutingModule
	],
	declarations: [ ProductPage ]
})
export class ProductPageModule {}
