import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ProductsModule } from '../../components/products/products.module';
import { FilterPageModule } from '../../modals/filter/filter.module';
import { FilterPage } from '../../modals/filter/filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ProductsModule,
    FilterPageModule
  ],
  declarations: [HomePage],
  entryComponents:[FilterPage]
})
export class HomePageModule {}
