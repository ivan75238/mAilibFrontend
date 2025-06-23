import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Logo from '../../svg/Logo';
import SearchBooks from '../SearchBooks';

const Header = observer(() => {
	return (
		<MainWrapper>
			<Logo />
			<SearchBooks />
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 84px;
	padding: 20px 60px;
	background: linear-gradient(
		89.66deg,
		rgba(255, 217, 102, 0.74) -6.48%,
		rgba(255, 169, 199, 0.74) 42.82%,
		rgba(184, 124, 255, 0.74) 99.72%
	);
	border-radius: 0px 0px 20px 20px;

	> svg {
		height: 50px;
	}
`;

export default Header;
