export interface Product {
	id?: number;
	nombre?: string;
	other_names?: string[];
	imagen?: null;
	status?: boolean;
	tags?: Tag[];
	sale_prices?: SalePrice[];
	unit_id?: number;
	purchase_price?: number;
	unit?: Unit;
}

export interface SalePrice {
	unit_id?: number;
	product_id?: number;
	detalle?: number;
	unit?: Unit;
}

export interface Tag {
	id?: number;
	nombre?: string;
	isChecked: boolean | false;
}
export interface Unit {
	id?: number;
	nombre?: string;
	isChecked?: boolean | false;
}

export interface NewProduct {
	nombre?: string;
	other_names?: string[];
	imagen?: string;
	tag_ids?: number[];
	sale_prices?: SalePrice[];
	unit_id?: number;
	purchase_price?: number;
}

export interface Segment {
	current_page?: number;
	data?: any[];
	first_page_url?: string;
	from?: number;
	last_page?: number;
	last_page_url?: string;
	next_page_url?: string;
	path?: string;
	per_page?: number;
	prev_page_url?: number;
	to?: number;
	total?: number;
}

export interface SegmentProduct extends Segment {
	data?: Product[];
}
