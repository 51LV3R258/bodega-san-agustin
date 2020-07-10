export interface Product {
	id?: number;
	nombre?: string;
	other_names?: string[];
	imagen?: null;
	status?: boolean;
	tags?: Tag[];
	prices?: Price[];
}

export interface Price {
	detalle?: string;
	unit?: Unit;
}

export interface Tag {
	id?: number;
	nombre?: string;
}
export interface Unit {
	id?: number;
	nombre?: string;
}

export interface NewProduct {
	nombre?: string;
	other_names?: string[];
	imagen?:string;
	tag_ids?: number[];
	prices?: NewPrice[];
}

export interface NewPrice {
	unit_id: number;
	detalle: number;
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
