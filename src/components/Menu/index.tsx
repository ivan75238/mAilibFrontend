import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import SeperatorMenuLine from '../../svg/SeperatorMenuLine';
import UserBlock from '../UserBlock';
import { menu } from '../../config/routes';
import MenuItem from './MenuItem';
import LogoutButton from './LogoutButton';
import useUserData from '../../hooks/useUserData';

const Menu = observer(() => {
	const { data } = useUserData();

	if (!data) return null;

	return (
		<MainWrapper>
			<TopWrapper>
				{menu.map((item) => {
					return (
						<MenuItem
							key={item.path}
							{...item}
						/>
					);
				})}
			</TopWrapper>
			<Line>
				<SeperatorMenuLine />
			</Line>
			<BottomWrapper>
				<UserBlock
					user={data}
					colorNumber={0}
				/>
				<LogoutButton />
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
	padding-top: 40px;
`;

const BottomWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	height: 200px;
	padding: 32px 14px 0 59px;
`;

const Line = styled.div`
	height: 2px;
	display: flex;
`;

export default Menu;
