import { FC, JSX, PropsWithChildren } from 'react';
import UnauthLayout from '../layouts/UnauthLayout';
import LoginPage from '../pages/LoginPage';
import MainLayout from '../layouts/MainLayout';
import { AuthGuard } from '../guards/auth';
import { UnauthGuard } from '../guards/unauth';
import RegistrationPage from '../pages/RegistrationPage';
import VerifyPage from '../pages/VerifyPage';
import ForgottenPage from '../pages/ForgottenPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import BookPage from '../pages/BookPage';
import BookIcon from '../svg/BookIcon';
import FamilyIcon from '../svg/FamilyIcon';
import FamilyPage from '../pages/FamilyPage';

export interface Route {
	path: string;
	element: () => JSX.Element | null;
	icon?: JSX.Element;
	layout: (props: PropsWithChildren) => JSX.Element;
	guard?: FC<any>;
	title?: string;
	isUnauth?: boolean;
	link: (...props: any) => string;
}

interface Routes {
	[key: string]: Route;
}

export const routes: Routes = {
	main: {
		path: '/',
		link: () => '/',
		element: LoginPage,
		guard: UnauthGuard,
		layout: UnauthLayout,
		isUnauth: true,
		title: 'main',
	},
	registration: {
		path: '/registration',
		link: () => '/registration',
		element: RegistrationPage,
		guard: UnauthGuard,
		layout: UnauthLayout,
		isUnauth: true,
		title: 'main',
	},
	verify: {
		path: '/verify',
		link: () => '/verify',
		element: VerifyPage,
		guard: UnauthGuard,
		layout: UnauthLayout,
		isUnauth: true,
		title: 'main',
	},
	forgottenPassword: {
		path: '/forgotten',
		link: () => '/forgotten',
		element: ForgottenPage,
		guard: UnauthGuard,
		layout: UnauthLayout,
		isUnauth: true,
		title: 'main',
	},
	changePassword: {
		path: '/up_pas/:token',
		link: (token: string) => `/up_pas/${token}`,
		element: ChangePasswordPage,
		guard: UnauthGuard,
		layout: UnauthLayout,
		isUnauth: true,
		title: 'main',
	},
	myBooks: {
		path: '/my-books',
		link: () => '/my-books',
		element: () => <div />,
		guard: AuthGuard,
		layout: MainLayout,
		title: 'Мои книги',
		icon: <BookIcon />,
	},
	book: {
		path: '/book/:id',
		link: (id: string | number) => `/book/${id}`,
		element: BookPage,
		guard: AuthGuard,
		layout: MainLayout,
		title: 'main',
	},
	family: {
		path: '/family',
		link: () => `/family`,
		element: FamilyPage,
		guard: AuthGuard,
		layout: MainLayout,
		title: 'Семья',
		icon: <FamilyIcon />,
	},
};

export const menu = [routes.myBooks, routes.family];
