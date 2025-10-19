import { Dialog } from 'primereact/dialog';
import { useCallback, useMemo, useState } from 'react';
import useUserData from '../../hooks/useUserData';
import styled from 'styled-components';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import Button from '../../components/Button';
import useFamilyData from '../../hooks/useFamilyData';
import useUnmarkAsReadBook from '../../hooks/useUnmarkAsReadBook';

interface IUnmarkAsReadBookModalProps {
	onClose: () => void;
	bookId: string;
	bookType: string;
	usersDoesntReadBookInFamily: string[];
}

const UnmarkAsReadBookModal = ({
	onClose,
	bookId,
	bookType,
	usersDoesntReadBookInFamily,
}: IUnmarkAsReadBookModalProps) => {
	const [selectedReaders, setSelectedReaders] = useState<string[]>([]);
	const { data: userData } = useUserData();
	const { data } = useFamilyData();
	const mutationUnmarkBook = useUnmarkAsReadBook(bookType, bookId, selectedReaders);

	const usersOptions = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.users
			.filter((i) => !usersDoesntReadBookInFamily.includes(i.id))
			.filter((i) => !selectedReaders.includes(i.id))
			.map((i) => {
				return {
					name: `${i.last_name} ${i.first_name}`,
					code: i.id,
				};
			});
	}, [data, selectedReaders, usersDoesntReadBookInFamily]);

	const onSelectReader = useCallback(
		(e: DropdownChangeEvent) => {
			setSelectedReaders([...selectedReaders, e.value.code]);
		},
		[selectedReaders]
	);

	const onReaderDelete = useCallback(
		(userId: string) => {
			setSelectedReaders(selectedReaders.filter((i) => i !== userId));
		},
		[selectedReaders]
	);

	const onAdd = useCallback(() => {
		mutationUnmarkBook.mutate();
		onClose();
	}, [selectedReaders, mutationUnmarkBook]);

	return (
		<Dialog
			header='Снять пометку о прочитанном'
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
							onChange={onSelectReader}
							options={usersOptions}
							placeholder='Выберите членов семьи'
							className='w-full'
							optionLabel='name'
						/>
						{selectedReaders.map((ownerId) => {
							const owner = data?.users.find((i) => i.id === ownerId);
							return (
								<Row key={ownerId}>
									<UserName>
										{owner?.last_name} {owner?.first_name}
									</UserName>
									<div>
										<i
											className='pi pi-times'
											onClick={() => onReaderDelete(ownerId)}
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
					label={'Снять'}
					onClick={onAdd}
					disabled={!selectedReaders.length}
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

export default UnmarkAsReadBookModal;
