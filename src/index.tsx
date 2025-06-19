import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './service-worker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>
);

serviceWorkerRegistration.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		if (registration.waiting) {
			if (window.confirm('Доступна новая версия. Обновить?')) {
				registration.waiting.postMessage({ type: 'SKIP_WAITING' });
				window.location.reload();
			}
		}
	},
	onSuccess: (registration) => {
		console.log('ServiceWorker успешно зарегистрирован', registration);
	},
	onError: (error) => {
		console.error('Ошибка при регистрации ServiceWorker:', error);
	},
});
