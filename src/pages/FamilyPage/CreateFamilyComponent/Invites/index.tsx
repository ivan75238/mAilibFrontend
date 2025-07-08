import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { IInviteToFamily } from '../../../../interface/IInviteToFamily';
import { apiRequester } from '../../../../utils/apiRequester';
import {
	FAMILY_INVITE_ACCEPT,
	FAMILY_INVITE_LIST,
	FAMILY_INVITE_REJECT,
} from '../../../../config/urls';
import Button from '../../../../components/Button';
import useUserData from '../../../../hooks/useUserData';

const Invites = observer(() => {
	const queryClient = useQueryClient();
	const { data: userData } = useUserData();

	const { data } = useQuery<IInviteToFamily[]>({
		queryKey: [`invites`, userData?.id],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IInviteToFamily[]>(FAMILY_INVITE_LIST);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const acceptInvite = useMutation({
		mutationFn: (inviteId: string) => {
			return apiRequester.post(FAMILY_INVITE_ACCEPT, { invite_id: inviteId });
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [`invites`, userData?.id], exact: true });
			await queryClient.refetchQueries({ queryKey: [`family`, userData?.id], exact: true });
			await queryClient.refetchQueries({ queryKey: ['userData'], exact: true });
		},
	});

	const rejectInvite = useMutation({
		mutationFn: (inviteId: string) => {
			return apiRequester.post(FAMILY_INVITE_REJECT, { invite_id: inviteId });
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [`invites`, userData?.id] });
		},
	});

	if (!data?.length) return null;

	return (
		<Wrapper>
			{data.map((invite) => (
				<ItemWrapper key={invite.id}>
					<Message>
						{invite.leader_first_name} {invite.leader_last_name} приглашает Вас присоединиться к
						семье
					</Message>
					<ButtonsWrapper>
						<Button
							label={'Принять'}
							onClick={() => acceptInvite.mutate(invite.id)}
							width={260}
						/>
						<Button
							label={'Отклонить'}
							onClick={() => rejectInvite.mutate(invite.id)}
							outlined
							width={260}
						/>
					</ButtonsWrapper>
				</ItemWrapper>
			))}
		</Wrapper>
	);
});

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 16px;
`;

const ItemWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	gap: 16px;
	box-shadow: 0px 0px 20px rgba(19, 0, 32, 0.15);
	border-radius: 12px;
	padding: 34px 0;
`;

const Message = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 24px;
	color: #262626;
`;

const ButtonsWrapper = styled.div`
	display: flex;
	gap: 48px;
`;

export default Invites;
