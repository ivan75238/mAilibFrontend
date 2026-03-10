import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { ANALYTICS_FAMILY_RECENT } from '../config/urls';
import useUserData from './useUserData';
import { IFamilyRecentReads } from '../interface/IFamilyRecentReads';

const useFamilyRecentReads = () => {
	const { data: user, isLoading: isLoadingUser } = useUserData();

	const query: UseQueryResult<IFamilyRecentReads[], Error> = useQuery({
		queryKey: ['family-recent-reads', user?.id],
		queryFn: async () => {
			const response = await apiRequester.get<IFamilyRecentReads[]>(
				ANALYTICS_FAMILY_RECENT
			);
			return response.data;
		},
		enabled: !!user?.family_id && !isLoadingUser,
	});

	return query;
};

export default useFamilyRecentReads;
