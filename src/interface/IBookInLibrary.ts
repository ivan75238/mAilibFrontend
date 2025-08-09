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
}
