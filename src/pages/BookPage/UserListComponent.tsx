import styled from 'styled-components';
import { Tooltip } from 'primereact/tooltip';
import UserBlock from '../../components/UserBlock';
import { IUser } from '../../interface/IUser';

interface IUserListComponentProps {
	users: IUser[];
	title: string;
}

const UserListComponent = ({ users, title }: IUserListComponentProps) => {
	if (users.length === 0) return null;

	return (
		<Wrapper>
			<Tooltip
				target='.user'
				mouseTrack
				mouseTrackLeft={10}
			/>
			<p>{title}</p>
			{users.map((user, i) => {
				return (
					<UserBlock
						user={user}
						key={user.id}
						colorNumber={i}
						tooltipContent={`${user.last_name} ${user.first_name}`}
						hideName
					/>
				);
			})}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 8px;

	p {
		margin: 0;
	}

	> div > div {
		width: 26px;
		height: 26px;
		font-size: 14px;
		cursor: default;
	}
`;

export default UserListComponent;
