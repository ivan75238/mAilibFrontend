import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { IUser } from '../../interface/IUser';

interface IProps {
	user: IUser;
	colorNumber: number;
}

const UserBlock = observer(({ user, colorNumber }: IProps) => {
	return (
		<MainWrapper>
			<UserIconWrapper colorNumber={colorNumber}>
				{user.first_name.substring(0, 1).toLocaleUpperCase()}
			</UserIconWrapper>
			{user.first_name} {user.last_name}
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 22px;
	color: #262626;
`;

const getBackgroundColor = (colorNumber: number) => {
	switch (colorNumber) {
		case 1:
			return 'linear-gradient(95.3deg, #c53af8 12.5%, #fa4bb4 57.41%, #ff4157 92.96%)';
		case 2:
			return 'linear-gradient(90.76deg, #FFF873 0%, #F88655 59.61%, #FF3437 106.79%)';
		case 3:
			return 'linear-gradient(95.99deg, #73C7FF 10.76%, #9655F8 50.29%, #E555F8 89.56%)';
		case 4:
			return 'linear-gradient(90.76deg, #737CFF 0%, #81F855 59.61%, #CBFE00 106.79%)';
		case 5:
			return 'linear-gradient(146.41deg, #A64CFF 2.89%, #BF8AFC 50%, #191FBB 109.47%)';
		default:
			return 'linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%)';
	}
};

const UserIconWrapper = styled.div<{ colorNumber: number }>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 52px;
	height: 52px;
	background: ${({ colorNumber }) => getBackgroundColor(colorNumber)};

	border-radius: 30px;
	font-style: normal;
	font-weight: 400;
	font-size: 32px;
	color: #ffffff;
`;

export default UserBlock;
