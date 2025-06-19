import { FC, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { routes } from '../config/routes';

export interface Props {
	children: ReactNode;
}

const UnauthGuard: FC<Props> = observer(({ children }) => {
	const navigate = useNavigate();
	let access_token = localStorage.getItem('accessToken');
	if (!access_token) {
		access_token = sessionStorage.getItem('accessToken');
	}

	useEffect(() => {
		if (access_token) {
			navigate(routes.myBooks.link());
		}
	}, []);

	return <>{children}</>;
});

export { UnauthGuard };
