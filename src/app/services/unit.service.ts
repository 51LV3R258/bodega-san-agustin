import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Unit } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
const URL = environment.url;
@Injectable({
	providedIn: 'root'
})
export class UnitService {
	constructor(private http: HttpClient, public storage: Storage) {}

	async indexAndStore(): Promise<boolean> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return new Promise((resolve) => {
			this.http.get(`${URL}/unit`, { headers: headers }).subscribe(
				async (response) => {
					if (response['code'] === 200) {
						await this.store(response['units']);
						resolve(true);
					}
					resolve(false);
				},
				(error) => {
					console.log(error);
					resolve(false);
				}
			);
		});
	}

	async store(data: Unit[]) {
		await this.storage.set('units', data);
	}

	//Cargar Units
	public units$: BehaviorSubject<Unit[]> = new BehaviorSubject<Unit[]>([]);
	load() {
		this.storage.get('units').then((units: Unit[]) => {
			this.units$.next(units);
		});
	}
}
