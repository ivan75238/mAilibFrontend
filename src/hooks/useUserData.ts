import { useQuery } from '@tanstack/react-query';
import { IUser } from '../interface/IUser';
import { apiRequester } from '../utils/apiRequester';
import { CURRENT_USER } from '../config/urls';

const useUserData = () => {
	const query = useQuery<IUser>({
		queryKey: ['userData'],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IUser>(CURRENT_USER);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
		retry: false,
	});

	return query;
};

export default useUserData;