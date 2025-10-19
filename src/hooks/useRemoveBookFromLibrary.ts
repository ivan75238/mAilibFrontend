import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { REMOVE_BOOK_FROM_LIBRARY } from '../config/urls';

const useRemoveBookFromLibrary = (
	bookType: string,
	bookId: string,
	ownerIds: string[],
) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			await apiRequester.post(REMOVE_BOOK_FROM_LIBRARY(bookType, bookId), {
				owner_ids: ownerIds,
			});
			queryClient.refetchQueries({ queryKey: [`book`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntHaveBookInFamily`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntReadBookInFamily`, bookId, bookType] });
		},
	});

	return mutation;
};

export default useRemoveBookFromLibrary;
