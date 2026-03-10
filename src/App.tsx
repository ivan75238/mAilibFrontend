import RoutesComponent from './components/RoutesComponent';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import GlobalStyle from './GlobalStyle';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { generalStore } from './stores/generalStore';
import { observer } from 'mobx-react-lite';
import 'primeicons/primeicons.css';

const App = observer(() => {
	const toast = useRef<Toast>(null);

	useEffect(() => {
		if (toast.current && !generalStore.toastRef.current) {
			generalStore.toastRef.current = toast.current;
		}
	}, [toast.current]);

	return (
		<PrimeReactProvider>
			<Toast ref={toast} />
			<GlobalStyle />
			<RoutesComponent />
		</PrimeReactProvider>
	);
});

export default App;
