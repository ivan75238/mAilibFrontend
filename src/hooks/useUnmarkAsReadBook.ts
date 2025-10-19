import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequester } from '../utils/apiRequester';
import { UNMARK_BOOK_AS_READED } from '../config/urls';

const useUnmarkAsReadBook = (bookType: string, bookId: string, readerIds: string[]) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			await apiRequester.post(UNMARK_BOOK_AS_READED(bookType, bookId), {
				reader_ids: readerIds,
			});
			queryClient.refetchQueries({ queryKey: [`book`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntHaveBookInFamily`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntReadBookInFamily`, bookId, bookType] });
		},
	});

	return mutation;
};

export default useUnmarkAsReadBook;
