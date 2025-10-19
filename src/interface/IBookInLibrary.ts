interface ReaderInfo {
	reader_id: string;
	reader_name: string;
	read_date: string;
}

interface IAuthorInBookLibrary {
	author_id: string;
	fantlab_id?: number;
	country?: string;
	author_name: string;
}

interface IGenreInBookLibrary {
	genre_id: string;
	fantlab_id?: number;
	genre_name: string;
}

export interface IBookInLibrary {
	id: string;
	name: string;
	fantlab_id: string;
	readers_info: ReaderInfo[];
	authors_info: IAuthorInBookLibrary[];
	genres_info: IGenreInBookLibrary[];
	readers: string;
	authors: string;
	genres: string;
	type: 'fantlab_work' | 'fantlab_edition' | 'inner_db_work';
}

export interface IResponseLibrary {
	data: IBookInLibrary[];
	pagination: Pagination;
	sort: Sort;
}

export interface Pagination {
	current_page: number;
	total_pages: number;
	total_items: number;
	items_per_page: number;
	has_previous: boolean;
	has_next: boolean;
}

export interface Sort {
	by: string;
	order: string;
}
