export const REFRESH = '/refresh';
export const CURRENT_USER = '/users/current';
export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const REGISTRATION = '/register';
export const RESEND_CODE = '/resendCode';
export const VERIFY = '/verify';
export const SEND_CHANGE_PASSWORD = '/sendChangePassword';
export const CHANGE_PASSWORD = '/changePassword';

export const BOOKS_SEARCH = '/books/search';
export const BOOKS_BOOK_CREATE = '/books/book/create';
export const MY_LIBRARY = '/books/library';
export const GET_BOOK = (type: string, id: string | number) => `/books/book/${type}/${id}`;
export const REMOVE_BOOK_FROM_LIBRARY = (type: string, id: string | number) =>
	`/books/book/${type}/${id}/remove`;
export const ADD_BOOK_TO_LIBRARY = (type: string, id: string | number) =>
	`/books/book/${type}/${id}/add`;
export const GET_USERS_IN_FAMILY_WHO_DOSTN_HAVE_BOOK = (type: string, id: string | number) =>
	`/books/book/${type}/${id}/existInfamily`;

export const FAMILY_CREATE = '/family/create';
export const FAMILY_GET = '/family/get';
export const FAMILY_INVITE_SEND = '/family/invite/send';
export const FAMILY_INVITE_LIST = '/family/invite/list';
export const FAMILY_INVITE_REJECT = '/family/invite/reject';
export const FAMILY_INVITE_ACCEPT = '/family/invite/accept';
export const FAMILY_DISSOLVE = '/family/dissolve';

export const AUTHORS_ALL = '/authors/all';
export const GENRES_ALL = '/genres/all';
export const CYCLES_ALL = '/cycles/all';
