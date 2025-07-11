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
export const GET_BOOK = (id: string | number) => `/books/book/${id}`;

export const FAMILY_CREATE = '/family/create';
export const FAMILY_GET = '/family/get';
export const FAMILY_INVITE_SEND = '/family/invite/send';
export const FAMILY_INVITE_LIST = '/family/invite/list';
export const FAMILY_INVITE_REJECT = '/family/invite/reject';
export const FAMILY_INVITE_ACCEPT = '/family/invite/accept';
export const FAMILY_DISSOLVE = '/family/dissolve';
