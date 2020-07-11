import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product, NewProduct, SegmentProduct } from '../interfaces/interfaces';
const URL = environment.url;
@Injectable({
	providedIn: 'root'
})
export class ProductService {
	ok = false;
	constructor(private http: HttpClient) {}

	async index(status?: boolean, tags?: number[], units?: number[]): Promise<{ ok: boolean; products: Product[] }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		let params = new HttpParams();
		if (status != null) {
			params = params.append('status', status.toString());
		}
		if (tags != null) {
			params = params.append('tags', `[${tags.toString()}]`);
		}
		if (units != null) {
			params = params.append('units', `[${units.toString()}]`);
		}

		return new Promise((resolve) => {
			let products: Product[] = [];
			this.http
				.get(`${URL}/product`, {
					params: params,
					headers: headers
				})
				.subscribe(
					async (response) => {
						if (response['code'] === 200) {
							products = response['products'];
							this.ok = true;
						}
						resolve({ ok: this.ok, products: products });
					},
					(error) => {
						console.log(error);
						resolve({ ok: this.ok, products: products });
					}
				);
		});
	}

	async update(newProduct: NewProduct, id: number): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			this.http.put(`${URL}/product/${id}`, newProduct, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						this.ok = true;
						resolve({ ok: this.ok, message: response['message'] });
					}
					resolve({ ok: this.ok, error: response['error'] });
				},
				(error) => {
					// console.log(error);
					let errorMessage = 'Ha ocurrido algún error al actualizar el producto, intentalo luego';
					if (error['error'].hasOwnProperty('firstError')) {
						errorMessage = error['error']['firstError'];
					}
					resolve({ ok: this.ok, error: errorMessage });
				}
			);
		});
	}

	async store(newProduct: NewProduct): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			this.http.post(`${URL}/product`, newProduct, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						this.ok = true;
						resolve({ ok: this.ok, message: response['message'] });
					}
					resolve({ ok: this.ok, error: response['error'] });
				},
				(error) => {
					// console.log(error['error']);
					let errorMessage = 'Ha ocurrido algún error al guardar el producto, intentalo luego';
					if (error['error'].hasOwnProperty('firstError')) {
						errorMessage = error['error']['firstError'];
					}
					resolve({ ok: this.ok, error: errorMessage });
				}
			);
		});
	}

	async delete(id: number): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			this.http.delete(`${URL}/product/${id}`, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						this.ok = true;
						resolve({ ok: this.ok, message: response['message'] });
					}
					resolve({ ok: this.ok, error: response['error'] });
				},
				(error) => {
					console.log(error);
					resolve({ ok: this.ok, error: 'Error al eliminar producto' });
				}
			);
		});
	}

	async search(query: string): Promise<{ ok: boolean; segment?: SegmentProduct; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		let params = new HttpParams().set('query', query);
		return new Promise((resolve) => {
			this.http
				.get(`${URL}/product`, {
					params: params,
					headers: headers
				})
				.subscribe(
					async (response) => {
						if (response['code'] === 200) {
							const segment: SegmentProduct = response['products'];
							this.ok = true;
							resolve({ ok: this.ok, segment: segment });
						}
						resolve({ ok: this.ok, error: response['error'] });
					},
					(error) => {
						console.log(error);
						resolve({ ok: this.ok, error: 'Error en la búsqueda' });
					}
				);
		});
	}
}
