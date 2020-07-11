import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Tag } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
const URL = environment.url;

@Injectable({
	providedIn: 'root'
})
export class TagService {
	constructor(private http: HttpClient, public storage: Storage) {}

	async indexAndStore(): Promise<boolean> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return new Promise((resolve) => {
			this.http.get(`${URL}/tag`, { headers: headers }).subscribe(
				async (response) => {
					if (response['code'] === 200) {
						await this.store(response['tags']);
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

	async store(data: Tag[]) {
		await this.storage.set('tags', data);
	}

	//Cargar Units
	public tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);
	load() {
		this.storage.get('tags').then((tags: Tag[]) => {
			this.tags$.next(tags);
		});
	}
}
