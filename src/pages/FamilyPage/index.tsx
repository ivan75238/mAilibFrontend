import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import CreateFamilyComponent from './CreateFamilyComponent';
import ExistFamilyComponent from './ExistFamilyComponent';
import useUserData from '../../hooks/useUserData';

const FamilyPage = observer(() => {
	const { data } = useUserData();

	return (
		<Wrapper>
			<PageTitle>Моя семья</PageTitle>
			{!data?.family_id ? <CreateFamilyComponent /> : <ExistFamilyComponent />}
		</Wrapper>
	);
});

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 52px 64px;
	position: relative;
`;

const PageTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 36px;
	line-height: 44px;
	color: #262626;
	padding-bottom: 28px;
`;

export default FamilyPage;
