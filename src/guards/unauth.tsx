import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

export interface Props {
	children: ReactNode;
}

const UnauthGuard: FC<Props> = observer(({ children }) => {
	return <>{children}</>;
});

export { UnauthGuard };
