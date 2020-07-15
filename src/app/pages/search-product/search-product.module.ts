import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchProductPageRoutingModule } from './search-product-routing.module';

import { SearchProductPage } from './search-product.page';
import { ProductsModule } from '../../components/products/products.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProductPageRoutingModule,
    ProductsModule
  ],
  declarations: [SearchProductPage]
})
export class SearchProductPageModule {}
