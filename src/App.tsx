import RoutesComponent from './components/RoutesComponent';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import GlobalStyle from './GlobalStyle';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { generalStore } from './stores/generalStore';
import { observer } from 'mobx-react-lite';
import { routes } from './config/routes';
import useUserData from './hooks/useUserData';

const App = observer(() => {
	const toast = useRef<Toast>(null);

	const { isLoading, isError } = useUserData();

	const isMatchingRoute = (path: string, routes: string[]) => {
		return routes.some((route) => {
			const regexPattern = route.replace(/\/:\w+/g, '/[^/]+');
			const regex = new RegExp(`^${regexPattern}$`);
			return regex.test(path);
		});
	};

	useEffect(() => {
		const accessUrls = Object.values(routes).map((i) => (i.isUnauth ? i.path : ''));
		if (isError && !isMatchingRoute(location.pathname, accessUrls)) {
			localStorage.removeItem('accessToken');
			sessionStorage.removeItem('accessToken');
			location.href = routes.main.path;
		}
	}, [isError]);

	useEffect(() => {
		if (toast.current && !generalStore.toastRef.current) {
			generalStore.toastRef.current = toast.current;
		}
	}, [toast.current]);

	return (
		<PrimeReactProvider>
			<Toast ref={toast} />
			<GlobalStyle />
			{!isLoading && <RoutesComponent />}
		</PrimeReactProvider>
	);
});

export default App;
