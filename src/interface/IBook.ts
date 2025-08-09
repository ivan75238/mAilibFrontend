import IAuthor from './IAuthor';
import ICycle from './ICycle';
import IGenre from './IGenre';

export interface IBook {
	id?: string;
	name: string;
	description?: string;
	image_small?: string;
	image_big?: string;
	fantlab_id?: string;
	isbn_list?: string;
	authors: IAuthor[];
	genres: IGenre[];
	cycles: ICycle[];
	is_own_by_user: boolean;
	is_read_by_user: boolean;
	type: 'fantlab_work' | 'fantlab_edition' | 'inner_db_work';
}
