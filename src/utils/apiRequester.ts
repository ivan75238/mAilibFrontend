import axios from 'axios';
import { generalStore } from '../stores/generalStore';
import { CURRENT_USER, REFRESH } from '../config/urls';
import { parseApiError } from './apiError';

const apiRequester = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

const handleOtherError = (error: any) => {
	if (
		error.response.status >= 400 &&
		error.response.status < 500 &&
		error.response.status !== 401
	) {
		const { message } = parseApiError(error);
		generalStore.showError(message || 'Неизвестная ошибка');
		return Promise.reject(error);
	} else if (error.response.status >= 500) {
		const { message } = parseApiError(error);
		generalStore.showError(message || 'Неизвестная ошибка');
		return Promise.reject(error);
	} else {
		return Promise.reject(error);
	}
};

const handle401Error = async (error: any) => {
	if (error?.response?.status === 401) {
		try {
			const originalRequest = error.config;
			if (originalRequest?.url?.includes(REFRESH)) return Promise.reject(error);
			if (originalRequest?.url?.includes(CURRENT_USER)) return Promise.reject(error);
			if (originalRequest._retry) return Promise.reject(error);

			originalRequest._retry = true;
			await apiRequester.post<{
				accessToken: string;
			}>(REFRESH, {});

			return apiRequester(originalRequest);
		} catch (e) {
			return Promise.reject(e);
		}
	}
	return Promise.reject(error);
};

apiRequester.interceptors.response.use((response) => response, handle401Error);
apiRequester.interceptors.response.use((response) => response, handleOtherError);

export { apiRequester };
