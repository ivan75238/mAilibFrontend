import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { apiRequester } from '../../../../utils/apiRequester';
import { FAMILY_DISSOLVE, FAMILY_GET } from '../../../../config/urls';
import { observer } from 'mobx-react-lite';
import { IFamily } from '../../../../interface/IFamily';
import { useMemo } from 'react';
import useUserData from '../../../../hooks/useUserData';
import UserBlock from '../../../../components/UserBlock';
import Button from '../../../../components/Button';

const MyFamilyList = observer(() => {
	const queryClient = useQueryClient();
	const { data: userData } = useUserData();

	const { data } = useQuery<IFamily>({
		queryKey: [`family`, userData?.id],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IFamily>(FAMILY_GET);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const myFamily = useMemo(() => {
		if (!data) {
			return null;
		}

		return {
			...data,
			users: data.users.filter((user) => user.id !== userData?.id),
		} as IFamily;
	}, [data]);

	const dissolveFamily = useMutation({
		mutationFn: () => {
			return apiRequester.post(FAMILY_DISSOLVE, {});
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: ['userData'], exact: true });
		},
	});

	if (!myFamily) return null;

	return (
		<FamilyListWrapper>
			{!myFamily.users.length ? (
				<TitleText>Члены семьи отсутствуют, отправьте приглашения.</TitleText>
			) : (
				<UsersWrapper>
					{myFamily.users.map((user, i) => {
						return (
							<UserBlock
								user={user}
								key={user.id}
								colorNumber={i}
							/>
						);
					})}
				</UsersWrapper>
			)}
			{userData?.id === myFamily.leader_id && (
				<Button
					label={'Распустить семью'}
					onClick={() => dissolveFamily.mutate()}
					width={320}
				/>
			)}
		</FamilyListWrapper>
	);
});

const FamilyListWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	width: 500px;
	gap: 16px;
	flex-wrap: wrap;
`;

const TitleText = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	color: #262626;
`;

const UsersWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-wrap: wrap;
	gap: 16px;
	width: 444px;
`;

export default MyFamilyList;
