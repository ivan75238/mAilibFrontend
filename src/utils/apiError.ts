export type ParsedApiError = {
	status?: number;
	code?: string;
	message?: string;
	details?: {
		fieldErrors?: Record<string, string[]>;
		[key: string]: unknown;
	};
};

export const parseApiError = (error: any): ParsedApiError => {
	const response = error?.response;
	const data = response?.data ?? {};
	const details = data?.details;

	return {
		status: response?.status,
		code: data?.code,
		message: data?.message ?? data?.error,
		details,
	};
};
