import { useQuery } from '@tanstack/react-query';
import { SortOrder } from 'primereact/datatable';
import { apiRequester } from '../utils/apiRequester';
import { MY_LIBRARY } from '../config/urls';
import { IResponseLibrary } from '../interface/IBookInLibrary';

const useMyBooksData = (page: number, limit: number, sortField: string, sortOrder: SortOrder) => {
	const query = useQuery<IResponseLibrary>({
		queryKey: [`my-books`, page, limit, sortField, sortOrder],
		queryFn: async () => {
			try {
				let sortF = sortField;
				switch (sortField) {
					case 'name':
						sortF = 'name';
						break;
					case 'authors':
						sortF = 'authors_info';
						break;
					case 'genres':
						sortF = 'authors_info';
						break;
				}

				const sortO = sortOrder === 1 ? 'ASC' : 'DESC';

				const response = await apiRequester.get<IResponseLibrary>(
					`${MY_LIBRARY}?page=${page + 1}&limit=${limit}&sortBy=${sortF}&sortOrder=${sortO}`
				);

				if (response.data.data) {
					response.data.data = response.data.data?.map((i) => ({
						...i,
						authors: i.authors_info.map((i) => i.author_name).join(', '),
						genres: i.genres_info.map((i) => i.genre_name).join(', '),
						readers: i.readers_info.map((i) => i.reader_name).join(', '),
					}));
				}

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	return query;
};

export default useMyBooksData;
