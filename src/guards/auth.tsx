import { FC, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import { routes } from '../config/routes';

export interface Props {
	children: ReactNode;
}

const AuthGuard: FC<Props> = observer(({ children }) => {
	const navigate = useNavigate();
	const { isLoading, isError } = useUserData();

	useEffect(() => {
		if (isError) {
			navigate(routes.main.link());
		}
	}, [isError]);

	if (isLoading || isError) return null;

	return <>{children}</>;
});

export { AuthGuard };
