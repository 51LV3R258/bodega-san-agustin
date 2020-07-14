import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tag, Unit } from '../../interfaces/interfaces';
import { UnitService } from '../../services/unit.service';
import { TagService } from '../../services/tag.service';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.page.html',
	styleUrls: [ './filter.page.scss' ],
	providers: [ UnitService, TagService ]
})
export class FilterPage implements OnInit {
	tags: Tag[];
	units: Unit[];
	@Input() tag_ids: number[];
	@Input() unit_ids: number[];
	constructor(public modalCtrl: ModalController, public tagService: TagService, public unitService: UnitService) {
		this.unitService.load();
		this.tagService.load();
	}

	ngOnInit() {
		this.unitService.units$.subscribe((units) => {
			this.units = units;
			this.initialSelectUnits();
		});
		this.tagService.tags$.subscribe((tags) => {
			this.tags = tags;
			this.initialSelectTags();
		});
	}

	ngOnDestroy() {
		this.unitService.units$.unsubscribe();
		this.tagService.tags$.unsubscribe();
	}

	initialSelectTags() {
		this.tags.forEach((tag) => {
			tag.isChecked = this.tag_ids.some((tag_id) => tag.id === tag_id);
		});
	}
	initialSelectUnits() {
		this.units.forEach((unit) => {
			unit.isChecked = this.unit_ids.some((unit_ids) => unit.id === unit_ids);
		});
	}
	applySelectTags() {
		this.tag_ids.splice(0, this.tag_ids.length);
		this.tags.forEach((tag) => {
			if (tag.isChecked) {
				this.tag_ids.push(tag.id);
			}
		});
	}
	applySelectUnits() {
		this.unit_ids.splice(0, this.unit_ids.length);
		this.units.forEach((unit) => {
			if (unit.isChecked) {
				this.unit_ids.push(unit.id);
			}
		});
	}

	cancel() {
		this.initialSelectTags();
		this.initialSelectUnits();
		this.modalCtrl.dismiss({
			refresh: false
		});
	}

	apply() {
		this.applySelectUnits();
		this.applySelectTags();
		this.modalCtrl.dismiss({
			refresh: true
		});
	}
}
