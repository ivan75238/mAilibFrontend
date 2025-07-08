import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import InviteForm from './InviteForm';
import MyFamilyList from './MyFamilyList';

const ExistFamilyComponent = observer(() => {
	return (
		<Wrapper>
			<MyFamilyList />
			<InviteForm />
		</Wrapper>
	);
});

const Wrapper = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 52px;
`;

export default ExistFamilyComponent;
