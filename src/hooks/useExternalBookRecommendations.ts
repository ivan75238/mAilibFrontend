import { useQuery } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { GET_BOOK_EXTERNAL_RECOMMENDATIONS } from '../config/urls';

export interface IExternalBookRecommendation {
	key: string;
	title: string;
	authors: string;
	genres: string[];
	year?: number;
	cover_url?: string;
	source: string;
	score: number;
	reason: string[];
	external_url: string;
}

interface IExternalBookRecommendationsResponse {
	items: IExternalBookRecommendation[];
}

const useExternalBookRecommendations = (id: string, type: string) => {
	return useQuery<IExternalBookRecommendationsResponse>({
		queryKey: ['book-external-recommendations', id, type],
		queryFn: async () => {
			const response = await apiRequester.get<IExternalBookRecommendationsResponse>(
				GET_BOOK_EXTERNAL_RECOMMENDATIONS(type, id)
			);
			return response.data;
		},
		enabled: !!id && !!type,
	});
};

export default useExternalBookRecommendations;
