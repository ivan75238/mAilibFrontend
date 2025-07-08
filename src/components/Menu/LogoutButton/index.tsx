import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../Button';
import { apiRequester } from '../../../utils/apiRequester';
import { LOGOUT } from '../../../config/urls';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../config/routes';

const LogoutButton = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: () => {
			return apiRequester.post(LOGOUT);
		},
		onSuccess: async () => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('accessToken');
			sessionStorage.removeItem('refreshToken');
			navigate(routes.main.link());
			queryClient.removeQueries();
			await queryClient.cancelQueries();
			queryClient.clear();
			window.location.reload();
		},
	});

	return (
		<Button
			label={'Выйти'}
			onClick={() => mutation.mutate()}
			height={38}
			width={180}
			outlined
		/>
	);
};

export default LogoutButton;
