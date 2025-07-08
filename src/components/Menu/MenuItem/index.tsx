import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Route } from '../../../config/routes';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';

const MenuItem = observer(({ path, icon, title }: Route) => {
	const resolved = useResolvedPath(path);
	const match = useMatch({ path: resolved.pathname, end: true });

	return (
		<Wrapper isActive={!!match}>
			<NavLink to={path}>
				{icon}
				{title}
			</NavLink>
		</Wrapper>
	);
});

const Wrapper = styled.div<{ isActive: boolean }>`
	a {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		text-decoration: unset;
		font-style: normal;
		font-weight: 400;
		font-size: 20px;
		line-height: 24px;
		color: #262626;
		padding: 12px 0 12px 58px;

		background: ${({ isActive }) => (isActive ? '#ffecc5' : 'transparent')};

		&:hover {
			color: #000000;
		}
	}
`;

export default MenuItem;
