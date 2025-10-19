import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { ADD_BOOK_TO_LIBRARY } from '../config/urls';

const useAddBookToLibrary = (
	bookType: string,
	bookId: string,
	ownerIds: string[],
	readerIds: string[]
) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			await apiRequester.post(ADD_BOOK_TO_LIBRARY(bookType, bookId), {
				owner_ids: ownerIds,
				reader_ids: readerIds,
			});
			queryClient.refetchQueries({ queryKey: [`book`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntHaveBookInFamily`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntReadBookInFamily`, bookId, bookType] });
		},
	});

	return mutation;
};

export default useAddBookToLibrary;
