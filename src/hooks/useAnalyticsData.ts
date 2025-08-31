import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { ANALYTICS_FAMILY, ANALYTICS_USER } from '../config/urls';
import useUserData from './useUserData';
import { IAnalytics } from '../interface/IAnalytics';

const useAnalyticsData = () => {
	const { data: user, isLoading: isLoadingUser } = useUserData();
	let query: UseQueryResult<IAnalytics[], Error> | undefined;

	if (user?.family_id) {
		query = useQuery<IAnalytics[]>({
			queryKey: [`family-analytics`, user?.id],
			queryFn: async () => {
				try {
					const response = await apiRequester.get<IAnalytics[]>(ANALYTICS_FAMILY);

					return response.data;
				} catch (e) {
					throw new Error('Не удалось получить данные');
				}
			},
			enabled: !isLoadingUser,
		});
	} else {
		query = useQuery<IAnalytics[]>({
			queryKey: [`user-analytics`, user?.id],
			queryFn: async () => {
				try {
					const response = await apiRequester.get<IAnalytics[]>(ANALYTICS_USER);

					return response.data;
				} catch (e) {
					throw new Error('Не удалось получить данные');
				}
			},
			enabled: !isLoadingUser,
		});
	}

	return query;
};

export default useAnalyticsData;
