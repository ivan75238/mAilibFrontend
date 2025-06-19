import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

export interface Props {
	children: ReactNode;
}

const AuthGuard: FC<Props> = observer(({ children }) => {
	let access_token = localStorage.getItem('accessToken');
	if (!access_token) {
		access_token = sessionStorage.getItem('accessToken');
	}

	if (!access_token) {
		return null;
	}

	return <>{children}</>;
});

export { AuthGuard };
