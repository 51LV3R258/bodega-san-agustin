import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { ModalController, IonInput, IonCheckbox } from '@ionic/angular';
import { Unit, NewProduct, SalePrice } from '../../interfaces/interfaces';

@Component({
	selector: 'app-select-sale-prices',
	templateUrl: './select-sale-prices.page.html',
	styleUrls: [ './select-sale-prices.page.scss' ]
})
export class SelectSalePricesPage implements OnInit {
	@Input() units: Unit[];
	@Input() product: NewProduct;
	@ViewChildren(IonInput) ionInputs: QueryList<IonInput>;
	@ViewChildren(IonCheckbox) ionCheckboxes: QueryList<IonCheckbox>;
	constructor(public modalCtrl: ModalController) {}

	ngOnInit() {}

	ionViewWillEnter() {
		this.product.sale_prices.forEach((sale_price) => {
			for (const ionInput of this.ionInputs) {
				if (Number(ionInput.name) == sale_price.unit_id) {
					ionInput.value = sale_price.detalle;
					break;
				}
			}
			for (const checkbox of this.ionCheckboxes) {
				if (Number(checkbox.name) == sale_price.unit_id) {
					checkbox.checked = sale_price.calculate;
					break;
				}
			}
		});
	}

	close() {
		this.modalCtrl.dismiss();

		let sale_prices: SalePrice[] = [];
		this.ionInputs.forEach((ionInput) => {
			if (Number(ionInput.value) > 0) {
				const checkbox: IonCheckbox = this.ionCheckboxes.find((check) => check.name == ionInput.name);
				sale_prices.push({
					unit_id: Number(ionInput.name),
					detalle: Number(ionInput.value),
					calculate: checkbox.checked
				});
			} else {
				this.disableUnit(Number(ionInput.name));
			}
		});
		this.product.sale_prices = sale_prices;
	}

	disableUnit(unit_id: number) {
		for (const unit of this.units) {
			if (unit.id === unit_id) {
				unit.isChecked = false;
				break;
			}
		}
	}
	clearInput(isChecked: boolean) {
		if (!isChecked) {
			return '';
		}
	}
}
