import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tag, NewProduct } from '../../interfaces/interfaces';

@Component({
	selector: 'app-select-tags',
	templateUrl: './select-tags.page.html',
	styleUrls: [ './select-tags.page.scss' ]
})
export class SelectTagsPage implements OnInit {
	@Input() tags: Tag[];
	@Input() product: NewProduct;
	constructor(public modalCtrl: ModalController) {}

	ngOnInit() {}

	close() {
		this.modalCtrl.dismiss();
	}
	toggleTag(tag: Tag) {
		tag.isChecked = !tag.isChecked;
		if (tag.isChecked) {
			this.product.tag_ids.push(tag.id);
		} else {
			this.product.tag_ids = this.product.tag_ids.filter((id) => id !== tag.id);
		}
	}
}
