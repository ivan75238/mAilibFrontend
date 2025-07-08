import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import Button from '../../../components/Button';
import { apiRequester } from '../../../utils/apiRequester';
import { FAMILY_CREATE } from '../../../config/urls';
import { observer } from 'mobx-react-lite';
import Invites from './Invites';

const CreateFamilyComponent = observer(() => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => {
			return apiRequester.post(FAMILY_CREATE);
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: ['userData'] });
		},
	});

	return (
		<Wrapper>
			<Invites />
			<CreateFamilyWrapper>
				<span>
					На данный момент Вы не состоите в семье, дождитесь приглашения или создайте свою.
				</span>
				<Button
					label={'Создать семью'}
					onClick={() => mutation.mutate()}
					width={260}
				/>
			</CreateFamilyWrapper>
		</Wrapper>
	);
});

const Wrapper = styled.div`
	gap: 48px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
`;

const CreateFamilyWrapper = styled.div`
	gap: 48px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	margin-top: 116px;

	> span {
		text-align: center;
		font-style: normal;
		font-weight: 400;
		font-size: 20px;
		line-height: 24px;
		color: #262626;
	}
`;

export default CreateFamilyComponent;
