import { Dialog } from 'primereact/dialog';
import { useCallback, useMemo, useState } from 'react';
import useUserData from '../../hooks/useUserData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { ADD_BOOK_TO_LIBRARY } from '../../config/urls';
import styled from 'styled-components';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import useFamilyData from '../../hooks/useFamilyData';

interface IProps {
	onClose: () => void;
	bookId: string;
	bookType: string;
	usersDoesntHaveBookInFamily: string[];
}

const AddBookInLibraryModal = ({
	onClose,
	bookId,
	bookType,
	usersDoesntHaveBookInFamily,
}: IProps) => {
	const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
	const [selectedReaders, setSelectedReaders] = useState<string[]>([]);
	const { data: userData } = useUserData();
	const { data } = useFamilyData();
	const queryClient = useQueryClient();

	const usersOptions = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.users
			.filter((i) => usersDoesntHaveBookInFamily.includes(i.id))
			.filter((i) => !selectedOwners.includes(i.id))
			.map((i) => {
				return {
					name: `${i.last_name} ${i.first_name}`,
					code: i.id,
				};
			});
	}, [data, selectedOwners, usersDoesntHaveBookInFamily]);

	const onSelectOwner = useCallback(
		(e: DropdownChangeEvent) => {
			setSelectedOwners([...selectedOwners, e.value.code]);
		},
		[selectedOwners]
	);

	const onOwnerDelete = useCallback(
		(userId: string) => {
			setSelectedOwners(selectedOwners.filter((i) => i !== userId));
		},
		[selectedOwners]
	);

	const onCheckReader = useCallback(
		(userId: string) => {
			if (selectedReaders.includes(userId)) {
				setSelectedReaders(selectedReaders.filter((i) => i !== userId));
				return;
			} else {
				setSelectedReaders([...selectedReaders, userId]);
			}
		},
		[selectedReaders]
	);

	const mutation = useMutation({
		mutationFn: async () => {
			await apiRequester.post(ADD_BOOK_TO_LIBRARY(bookType, bookId), {
				owner_ids: selectedOwners,
				reader_ids: selectedReaders,
			});
			queryClient.refetchQueries({ queryKey: [`book`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntHaveBookInFamily`, bookId, bookType] });
			queryClient.refetchQueries({ queryKey: [`usersDoesntReadBookInFamily`, bookId, bookType] });
		},
	});

	const onAdd = useCallback(() => {
		mutation.mutate();
		onClose();
	}, [selectedReaders, selectedOwners]);

	return (
		<Dialog
			header='Добавление книги в библиотеку'
			visible={true}
			style={{ width: '450px' }}
			onHide={onClose}
			breakpoints={{
				'375px': '375px',
			}}>
			<FormWrapper>
				{userData?.family_id ? (
					<>
						<Dropdown
							onChange={onSelectOwner}
							options={usersOptions}
							placeholder='Выберите членов семьи'
							className='w-full'
							optionLabel='name'
						/>
						{selectedOwners.map((ownerId) => {
							const owner = data?.users.find((i) => i.id === ownerId);
							return (
								<Row key={ownerId}>
									<UserName>
										{owner?.last_name} {owner?.first_name}
									</UserName>
									<div>
										<Checkbox
											label='Прочитано'
											checked={!!selectedReaders.includes(ownerId)}
											onChange={() => onCheckReader(ownerId)}
										/>
										<i
											className='pi pi-times'
											onClick={() => onOwnerDelete(ownerId)}
										/>
									</div>
								</Row>
							);
						})}
					</>
				) : (
					<></>
				)}
				<Button
					label={'Добавить'}
					onClick={onAdd}
					disabled={!selectedOwners.length}
				/>
			</FormWrapper>
		</Dialog>
	);
};

const FormWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 16px;
	width: 100%;

	.w-full {
		width: 100%;
	}
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	> div:last-child {
		width: auto;
		display: flex;
		align-items: center;
		gap: 8px;

		i {
			cursor: pointer;
		}
	}
`;

const UserName = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	color: #262626;
`;

export default AddBookInLibraryModal;
