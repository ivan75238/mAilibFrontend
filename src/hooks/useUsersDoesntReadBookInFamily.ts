import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { GET_USERS_IN_FAMILY_WHO_DOESNT_READ_BOOK } from '../config/urls';
import useBookData from './useBookData';

const useUsersDoesntReadBookInFamily = (id: string, type: string) => {
	const { isLoading } = useBookData(id, type);

	const query = useQuery<string[]>({
		queryKey: [`usersDoesntReadBookInFamily`, id, type],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<string[]>(
					GET_USERS_IN_FAMILY_WHO_DOESNT_READ_BOOK(type, id)
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

export default useUsersDoesntReadBookInFamily;
