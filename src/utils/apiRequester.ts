import axios from 'axios';
import { generalStore } from '../stores/generalStore';
import { REFRESH } from '../config/urls';

axios.defaults.withCredentials = true;

const apiRequester = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

apiRequester.interceptors.request.use(
	(config) => {
		let access_token = localStorage.getItem('accessToken');
		let refresh_token = localStorage.getItem('refreshToken');

		if (!access_token && !refresh_token) {
			access_token = sessionStorage.getItem('accessToken');
			refresh_token = sessionStorage.getItem('refreshToken');
		}

		if (access_token) {
			config.headers['authorization'] = `Bearer ${access_token}`;
		} else if (refresh_token) {
			config.headers['authorization'] = `Bearer ${refresh_token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const handleOtherError = (error: any) => {
	if (
		error.response.status >= 400 &&
		error.response.status < 500 &&
		error.response.status !== 401
	) {
		generalStore.showError(error.response.data.message || error.response.data.error);
		return Promise.reject(error);
	} else if (error.response.status >= 500) {
		generalStore.showError(error.response.data.message || error.response.data.error);
		return Promise.reject(error);
	} else {
		return Promise.reject(error);
	}
};

const handle401Error = async (error: any) => {
	if (error?.response?.status === 401) {
		try {
			const originalRequest = error.config;

			localStorage.removeItem('accessToken');
			sessionStorage.removeItem('accessToken');
			const refresh_token = localStorage.getItem('refreshToken');
			const refresh_token_session = sessionStorage.getItem('refreshToken');

			if (!refresh_token && !refresh_token_session) return null;

			const response = await apiRequester.post<{
				accessToken: string;
				refreshToken: string;
			}>(REFRESH, {});

			if (refresh_token) {
				localStorage.setItem('accessToken', response.data.accessToken);
				localStorage.setItem('refreshToken', response.data.refreshToken);
			} else {
				sessionStorage.setItem('accessToken', response.data.accessToken);
				sessionStorage.setItem('refreshToken', response.data.refreshToken);
			}

			originalRequest._retry = true;
			originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
			return apiRequester(originalRequest);
		} catch (e) {
			localStorage.removeItem('refresh_token');
			sessionStorage.removeItem('refresh_token');
		}
	}
	return Promise.reject(error);
};

apiRequester.interceptors.response.use((response) => response, handle401Error);
apiRequester.interceptors.response.use((response) => response, handleOtherError);

export { apiRequester };
