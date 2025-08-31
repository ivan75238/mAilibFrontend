import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { MY_LIBRARY } from '../config/urls';
import { IBookInLibrary } from '../interface/IBookInLibrary';

const useMyBooksData = () => {
	const query = useQuery<IBookInLibrary[]>({
		queryKey: [`my-books`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBookInLibrary[]>(MY_LIBRARY);

				return response.data.map((i) => ({
					...i,
					authors: i.authors_info.map((i) => i.author_name).join(', '),
					genres: i.genres_info.map((i) => i.genre_name).join(', '),
					readers: i.readers_info.map((i) => i.reader_name).join(', '),
				}));
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	return query;
};

export default useMyBooksData;
