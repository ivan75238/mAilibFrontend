import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import SeperatorMenuLine from '../../svg/SeperatorMenuLine';
import UserBlock from '../UserBlock';

const Menu = observer(() => {
	return (
		<MainWrapper>
			<TopWrapper></TopWrapper>
			<Line>
				<SeperatorMenuLine />
			</Line>
			<BottomWrapper>
				<UserBlock />
			</BottomWrapper>
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 288px;
	height: 100%;
	box-shadow: 0px 4px 8px rgba(19, 0, 32, 0.2);
`;

const TopWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: calc(100% - 202px);
	padding-top: 52px;
	padding-left: 59px;
`;

const BottomWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 200px;
	padding-top: 32px;
	padding-left: 59px;
`;

const Line = styled.div`
	height: 2px;
	display: flex;
`;

export default Menu;
