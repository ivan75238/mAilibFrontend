import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { IUser } from '../../interface/IUser';

const UserBlock = observer(() => {
	const queryClient = useQueryClient();
	const userData = queryClient.getQueryData<IUser>(['userData']);

	if (!userData) return null;

	return (
		<MainWrapper>
			<UserIconWrapper>{userData.first_name.substring(0, 1).toLocaleUpperCase()}</UserIconWrapper>
			{userData.first_name} {userData.last_name}
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

const UserIconWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 52px;
	height: 52px;
	background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
	border-radius: 30px;
	font-style: normal;
	font-weight: 400;
	font-size: 32px;
	color: #ffffff;
`;

export default UserBlock;
