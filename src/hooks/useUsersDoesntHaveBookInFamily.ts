import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { GET_USERS_IN_FAMILY_WHO_DOESNT_HAVE_BOOK } from '../config/urls';
import useBookData from './useBookData';

const useUsersDoesntHaveBookInFamily = (id: string, type: string) => {
	const { isLoading } = useBookData(id, type);

	const query = useQuery<string[]>({
		queryKey: [`usersDoesntHaveBookInFamily`, id, type],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<string[]>(
					GET_USERS_IN_FAMILY_WHO_DOESNT_HAVE_BOOK(type, id)
				);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
		enabled: !isLoading,
	});

	return query;
};

export default useUsersDoesntHaveBookInFamily;
