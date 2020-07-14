import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports:[ProductsComponent]
})
export class ProductsModule { }
