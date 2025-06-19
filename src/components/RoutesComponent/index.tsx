import { Fragment } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { routes } from '../../config/routes';
import FatalError from '../../pages/FatalError';
import ErrorBoundary from '../ErrorBoundary';

const unauthRoutes = Object.keys(routes).map((routeKey) => {
	const route = routes[routeKey];
	const Guard = route.guard || Fragment;
	const Layout = route.layout || Fragment;
	const Component: any = route.element;
	return {
		path: route.path,
		element: (
			<ErrorBoundary fallback={<FatalError />}>
				<Guard>
					<Layout>
						<Component />
					</Layout>
				</Guard>
			</ErrorBoundary>
		),
	} as RouteObject;
});

const RouterComponent = () => <RouterProvider router={createBrowserRouter(unauthRoutes)} />;

export default RouterComponent;
