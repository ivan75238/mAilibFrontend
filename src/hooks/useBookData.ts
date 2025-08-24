import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { GET_BOOK } from '../config/urls';
import { IBook } from '../interface/IBook';

const useBookData = (id: string, type: string) => {
	const query = useQuery<IBook>({
		queryKey: [`book`, id, type],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBook>(GET_BOOK(type, id));

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	return query;
};

export default useBookData;
