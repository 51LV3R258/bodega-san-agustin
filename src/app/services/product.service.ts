import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product, NewProduct, SegmentProduct } from '../interfaces/interfaces';
const URL = environment.url;
@Injectable({
	providedIn: 'root'
})
export class ProductService {
	constructor(private http: HttpClient) {}

	async index(status?: boolean, tags?: number[], units?: number[]): Promise<{ ok: boolean; products: Product[] }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		let params = new HttpParams();
		if (status != null) {
			params = params.append('status', status.toString());
		}
		if (tags != null && tags.length > 0) {
			params = params.append('tags', `[${tags.toString()}]`);
		}
		if (units != null && units.length > 0) {
			params = params.append('units', `[${units.toString()}]`);
		}

		return new Promise((resolve) => {
			let ok = false;
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
							ok = true;
						}
						resolve({ ok: ok, products: products });
					},
					(error) => {
						console.log(error);
						resolve({ ok: ok, products: products });
					}
				);
		});
	}

	async update(newProduct: NewProduct, id: number): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			let ok = false;
			this.http.put(`${URL}/product/${id}`, newProduct, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						ok = true;
						resolve({ ok: ok, message: response['message'] });
					}
					resolve({ ok: ok, error: response['error'] });
				},
				(error) => {
					// console.log(error);
					let errorMessage = 'Ha ocurrido algún error al actualizar el producto, intentalo luego';
					if (error['error'].hasOwnProperty('firstError')) {
						errorMessage = error['error']['firstError'];
					}
					resolve({ ok: ok, error: errorMessage });
				}
			);
		});
	}

	async store(newProduct: NewProduct): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			let ok = false;
			this.http.post(`${URL}/product`, newProduct, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						ok = true;
						resolve({ ok: ok, message: response['message'] });
					}
					resolve({ ok: ok, error: response['error'] });
				},
				(error) => {
					// console.log(error['error']);
					let errorMessage = 'Ha ocurrido algún error al guardar el producto, intentalo luego';
					if (error['error'].hasOwnProperty('firstError')) {
						errorMessage = error['error']['firstError'];
					}
					resolve({ ok: ok, error: errorMessage });
				}
			);
		});
	}

	async delete(id: number): Promise<{ ok: boolean; message?: string; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			let ok = false;
			this.http.delete(`${URL}/product/${id}`, { headers: headers }).subscribe(
				(response) => {
					if (response['code'] === 200) {
						ok = true;
						resolve({ ok: ok, message: response['message'] });
					}
					resolve({ ok: ok, error: response['error'] });
				},
				(error) => {
					console.log(error);
					resolve({ ok: ok, error: 'Error al eliminar producto' });
				}
			);
		});
	}

	async search(query: string): Promise<{ ok: boolean; segment?: SegmentProduct; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		let params = new HttpParams().set('query', query);
		return new Promise((resolve) => {
			let ok = false;
			this.http
				.get(`${URL}/product`, {
					params: params,
					headers: headers
				})
				.subscribe(
					async (response) => {
						if (response['code'] === 200) {
							const segment: SegmentProduct = response['products'];
							ok = true;
							resolve({ ok: ok, segment: segment });
						}
						resolve({ ok: ok, error: response['error'] });
					},
					(error) => {
						console.log(error);
						resolve({ ok: ok, error: 'Error en la búsqueda' });
					}
				);
		});
	}

	async show(product_id: number): Promise<{ ok: boolean; product?: Product; error?: any }> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return new Promise((resolve) => {
			let ok = false;
			let product: Product = null;
			this.http
				.get(`${URL}/product/${product_id}`, {
					headers: headers
				})
				.subscribe(
					async (response) => {
						if (response['code'] === 200) {
							product = response['product'];
							ok = true;
							resolve({ ok: ok, product: product });
						}
						resolve({ ok: ok, error: 'Ha ocurrido un error al buscar el producto' });
					},
					(error) => {
						console.log(error);
						resolve({ ok: ok, error: error['error']['error'] });
					}
				);
		});
	}
}
