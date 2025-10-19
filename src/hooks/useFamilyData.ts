import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { FAMILY_GET } from '../config/urls';
import { IFamily } from '../interface/IFamily';
import useUserData from './useUserData';

const useFamilyData = () => {
	const { data: userData } = useUserData();

	const query = useQuery<IFamily | null>({
		queryKey: [`family`, userData?.id],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IFamily & { error?: string }>(FAMILY_GET);

				if (response.data?.error) {
					return null;
				}

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	return query;
};

export default useFamilyData;
