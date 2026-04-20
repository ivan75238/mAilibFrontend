import { Dialog } from 'primereact/dialog';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import Button from '../../components/Button';
import useFamilyData from '../../hooks/useFamilyData';
import useRemoveBookFromLibrary from '../../hooks/useRemoveBookFromLibrary';

interface IRemoveBookFromLibraryModalProps {
	onClose: () => void;
	bookId: string;
	bookType: string;
	usersDoesntHaveBookInFamily: string[];
}

const RemoveBookFromLibraryModal = ({
	onClose,
	bookId,
	bookType,
	usersDoesntHaveBookInFamily,
}: IRemoveBookFromLibraryModalProps) => {
	const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
	const { data } = useFamilyData();
	const mutationRemoveBook = useRemoveBookFromLibrary(bookType, bookId, selectedOwners);

	const usersOptions = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.users
			.filter((i) => !usersDoesntHaveBookInFamily.includes(i.id))
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

	const onAdd = useCallback(() => {
		mutationRemoveBook.mutate();
		onClose();
	}, [selectedOwners]);

	const onOwnerDelete = useCallback(
		(userId: string) => {
			setSelectedOwners(selectedOwners.filter((i) => i !== userId));
		},
		[selectedOwners]
	);

	return (
		<Dialog
			header='Удаление книги из библиотеки'
			appendTo='self'
			visible={true}
			style={{ width: '450px' }}
			onHide={onClose}
			breakpoints={{
				'375px': '375px',
			}}>
			<FormWrapper>
				<Dropdown
					onChange={onSelectOwner}
					options={usersOptions}
					placeholder='Выберите членов семьи, у кого удалить книгу'
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
								<i
									className='pi pi-times'
									onClick={() => onOwnerDelete(ownerId)}
								/>
							</div>
						</Row>
					);
				})}
				<Button
					label={'Удалить'}
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

export default RemoveBookFromLibraryModal;
