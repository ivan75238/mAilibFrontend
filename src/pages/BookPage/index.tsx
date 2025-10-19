import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';
import { routes } from '../../config/routes';
import BookEmptyImageIcon from '../../svg/BookEmptyImageIcon';
import AddBookInLibraryModal from './AddBookInLibraryModal';
import useUserData from '../../hooks/useUserData';
import useFamilyData from '../../hooks/useFamilyData';
import useBookData from '../../hooks/useBookData';
import UserListComponent from './UserListComponent';
import useUsersDoesntHaveBookInFamily from '../../hooks/useUsersDoesntHaveBookInFamily';
import useUsersDoesntReadBookInFamily from '../../hooks/useUsersDoesntReadBookInFamily';
import RemoveBookFromLibraryModal from './RemoveBookFromLibraryModal';
import MarkAsReadBookModal from './MarkAsReadBookModal';
import UnmarkAsReadBookModal from './UnmarkAsReadBookModal';
import useAddBookToLibrary from '../../hooks/useAddBookToLibrary';
import useRemoveBookFromLibrary from '../../hooks/useRemoveBookFromLibrary';
import useMarkAsReadBook from '../../hooks/useMarkAsReadBook';
import useUnmarkAsReadBook from '../../hooks/useUnmarkAsReadBook';

const BookPage = () => {
	const { id, type } = useParams();
	const navigate = useNavigate();
	const { data: userData } = useUserData();
	const { data: familyData, isLoading: isLoadingFamily } = useFamilyData();
	const [showMore, setShowMore] = useState(false);
	const [visibleAddModal, setVisibleAddModal] = useState(false);
	const [visibleRemoveModal, setVisibleRemoveModal] = useState(false);
	const [visibleMarkAsReadModal, setVisibleMarkAsReadModal] = useState(false);
	const [visibleUnmarkAsReadModal, setVisibleUnmarkAsReadModal] = useState(false);
	const descriptionRef = useRef<HTMLDivElement>(null);
	const mutationAddBook = useAddBookToLibrary(type || '', id || '', [userData?.id || ''], []);
	const mutationRemoveBook = useRemoveBookFromLibrary(type || '', id || '', [userData?.id || '']);
	const mutationMarkBook = useMarkAsReadBook(type || '', id || '', [userData?.id || '']);
	const mutationUnmarkBook = useUnmarkAsReadBook(type || '', id || '', [userData?.id || '']);

	if (!id || !type) {
		navigate(routes.main.path);
		return null;
	}

	const { data, isLoading } = useBookData(id, type);
	const { isLoading: isLoadingExistInFamily, data: usersDoesntHaveBookInFamily } =
		useUsersDoesntHaveBookInFamily(id, type);
	const { isLoading: isLoadingReadInFamily, data: usersDoesntReadBookInFamily } =
		useUsersDoesntReadBookInFamily(id, type);

	const bookActions = useMemo(() => {
		if (!data) {
			return [];
		}

		let title = '';
		let disabledButtonAddBook = false;
		let disabledButtonDeleteBook = false;
		let disabledButtonMarkAsReadBook = false;
		let disabledButtonUnmarkAsReadBook = false;

		if (userData?.family_id) {
			title = 'Действия';
			disabledButtonAddBook = usersDoesntHaveBookInFamily?.length === 0;
			disabledButtonDeleteBook = usersDoesntHaveBookInFamily?.length === familyData?.users?.length;
			disabledButtonMarkAsReadBook = usersDoesntReadBookInFamily?.length === 0;
			disabledButtonUnmarkAsReadBook =
				usersDoesntReadBookInFamily?.length === familyData?.users?.length;
			usersDoesntReadBookInFamily?.length === familyData?.users?.length;
		} else {
			if (data.is_read_by_user) {
				title = 'Прочитано';
				disabledButtonAddBook = true;
				disabledButtonMarkAsReadBook = true;
			} else if (data.is_own_by_user) {
				title = 'Добавлено';
				disabledButtonAddBook = true;
				disabledButtonUnmarkAsReadBook = true;
			} else {
				title = 'Не добавлено';
				disabledButtonDeleteBook = true;
				disabledButtonMarkAsReadBook = true;
				disabledButtonUnmarkAsReadBook = true;
			}
		}

		const obj = [
			{
				label: title,
				icon: 'pi pi-box',
				items: [
					[
						{
							items: [
								{
									label: 'Добавить в библиотеку',
									disabled: disabledButtonAddBook,
									command: () =>
										userData?.family_id ? setVisibleAddModal(true) : mutationAddBook.mutate(),
								},
								{
									label: 'Удалить из библиотеки',
									disabled: disabledButtonDeleteBook,
									command: () =>
										userData?.family_id ? setVisibleRemoveModal(true) : mutationRemoveBook.mutate(),
								},
								{
									label: 'Отметить как прочитанную',
									disabled: disabledButtonMarkAsReadBook,
									command: () =>
										userData?.family_id
											? setVisibleMarkAsReadModal(true)
											: mutationMarkBook.mutate(),
								},
								{
									label: 'Снять отметку о прочитанном',
									disabled: disabledButtonUnmarkAsReadBook,
									command: () =>
										userData?.family_id
											? setVisibleUnmarkAsReadModal(true)
											: mutationUnmarkBook.mutate(),
								},
							],
						},
					],
				],
			},
		] as MenuItem[];

		return obj;
	}, [data, familyData, userData]);

	const owners = useMemo(() => {
		if (!familyData) {
			return [];
		}

		return familyData.users.filter((i) => !usersDoesntHaveBookInFamily?.includes(i.id));
	}, [data, usersDoesntHaveBookInFamily, familyData]);

	const readers = useMemo(() => {
		if (!familyData) {
			return [];
		}

		return familyData.users.filter((i) => !usersDoesntReadBookInFamily?.includes(i.id));
	}, [data, usersDoesntReadBookInFamily, familyData]);

	if (isLoading || !data || isLoadingExistInFamily || isLoadingFamily || isLoadingReadInFamily)
		return null;

	return (
		<Wrapper>
			<LeftColumn>
				{data.image_big ? (
					type === 'inner_db_work' ? (
						<img src={data.image_big} />
					) : (
						<img src={`https://fantlab.ru/${data.image_big}`} />
					)
				) : (
					<EmptyImageWrapper>
						<BookEmptyImageIcon />
						<p>{data.name}</p>
					</EmptyImageWrapper>
				)}
				<ButtonAddedWrapper>
					<MegaMenu
						model={bookActions}
						breakpoint='960px'
					/>
				</ButtonAddedWrapper>
				<UserListComponent
					title={'Владельцы:'}
					users={owners}
				/>
				<UserListComponent
					title={'Прочитали:'}
					users={readers}
				/>
			</LeftColumn>
			<RightColumn>
				<BookNameTitle>{data.name}</BookNameTitle>
				<AuthorAndCyclesWrapper>
					<p>
						Автор: <span>{data.authors.map((i) => i.name).join(', ')}</span>
					</p>
					{data.cycles.length > 0 && (
						<p>
							Входит в серию: <span>{data.cycles.map((i) => i.name).join(', ')}</span>
						</p>
					)}
				</AuthorAndCyclesWrapper>
				<DescriptionWrapper>
					<DescriptionHeader>О книге</DescriptionHeader>
					<DescriptionText
						ref={descriptionRef}
						showMore={showMore}
						dangerouslySetInnerHTML={{
							__html: data.description
								? (data.description || '').replace(/\n/g, '<br>')
								: 'Описание отсутствует',
						}}
					/>
					{descriptionRef.current &&
						descriptionRef.current.offsetHeight > 250 &&
						data.description &&
						!showMore && <ShowMoreButton onClick={() => setShowMore(true)}>Далее</ShowMoreButton>}
				</DescriptionWrapper>
			</RightColumn>
			{visibleAddModal && (
				<AddBookInLibraryModal
					bookId={id}
					bookType={type}
					usersDoesntHaveBookInFamily={usersDoesntHaveBookInFamily || []}
					onClose={() => setVisibleAddModal(false)}
				/>
			)}
			{visibleRemoveModal && (
				<RemoveBookFromLibraryModal
					bookId={id}
					bookType={type}
					usersDoesntHaveBookInFamily={usersDoesntHaveBookInFamily || []}
					onClose={() => setVisibleRemoveModal(false)}
				/>
			)}
			{visibleMarkAsReadModal && (
				<MarkAsReadBookModal
					bookId={id}
					bookType={type}
					usersDoesntReadBookInFamily={usersDoesntReadBookInFamily || []}
					onClose={() => setVisibleMarkAsReadModal(false)}
				/>
			)}
			{visibleUnmarkAsReadModal && (
				<UnmarkAsReadBookModal
					bookId={id}
					bookType={type}
					usersDoesntReadBookInFamily={usersDoesntReadBookInFamily || []}
					onClose={() => setVisibleUnmarkAsReadModal(false)}
				/>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	gap: 54px;
	display: flex;
	padding: 52px 64px;

	@media (max-width: 960px) {
		padding: 16px;
	}

	@media (max-width: 400px) {
		flex-direction: column;
		overflow-y: auto;
		max-width: calc(100vh - 84px);
	}
`;

const LeftColumn = styled.div`
	width: 320px;
	flex-direction: column;
	display: flex;
	gap: 36px;

	img {
		width: 320px;
		height: 507px;
		filter: drop-shadow(0px 0px 12px rgba(19, 0, 32, 0.25));
		border-radius: 8px;
	}

	@media (max-width: 960px) {
		width: 240px;

		img {
			width: 240px;
			height: 360px;
		}
	}

	@media (max-width: 400px) {
		width: 100%;
		align-items: center;
	}
`;

const EmptyImageWrapper = styled.div`
	width: 320px;
	height: 507px;
	background: #e4cffd;
	border-radius: 8px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		position: absolute;
		top: 100px;
	}

	p {
		position: absolute;
		top: 270px;
		font-style: normal;
		font-weight: 500;
		font-size: 24px;
		text-align: center;
		color: #743bb1;
	}

	@media (max-width: 960px) {
		width: 240px;
		height: 360px;
	}
`;

const RightColumn = styled.div`
	width: calc(100% - 320px);
	display: flex;
	flex-direction: column;
	gap: 24px;

	@media (max-width: 960px) {
		width: calc(100% - 240px);
		gap: 16px;
	}

	@media (max-width: 400px) {
		width: 100%;
		gap: 16px;
		padding: 0 16px;
	}
`;

const BookNameTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 40px;
	line-height: 49px;
	color: #262626;

	@media (max-width: 960px) {
		font-size: 24px;
		line-height: 24px;
	}
`;

const AuthorAndCyclesWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	font-style: normal;
	font-weight: 400;
	font-size: 28px;
	line-height: 34px;
	color: #818181;

	p {
		margin: 0;
	}

	span {
		color: #262626;
	}

	@media (max-width: 960px) {
		font-size: 20px;
		line-height: 20px;
	}
`;

const DescriptionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;

	@media (max-width: 960px) {
		gap: 8px;
	}
`;

const DescriptionHeader = styled.div`
	font-style: normal;
	font-weight: 500;
	font-size: 32px;
	line-height: 39px;
	color: #262626;

	@media (max-width: 960px) {
		font-size: 24px;
		line-height: 24px;
	}
`;

const DescriptionText = styled.div<{ showMore: boolean }>`
	font-style: normal;
	font-weight: 300;
	font-size: 26px;
	line-height: 31px;
	text-indent: 16px;
	color: #262626;
	height: 100%;
	max-height: ${({ showMore }) => (!showMore ? '287px' : '400px')};

	${({ showMore }) => {
		if (!showMore) {
			return `
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 9;
				overflow: hidden;
				text-overflow: ellipsis;
			`;
		} else {
			return `overflow-y: auto;`;
		}
	}}

	@media (max-width: 960px) {
		font-size: 16px;
		line-height: 18px;
	}
`;

const ShowMoreButton = styled.div`
	cursor: pointer;
	font-style: normal;
	font-weight: 400;
	font-size: 28px;
	line-height: 34px;
	color: #bf8afc;

	@media (max-width: 960px) {
		font-size: 20px;
		line-height: 26px;
	}
`;

const ButtonAddedWrapper = styled.div`
	> div {
		background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
		border: 0px;
		border-radius: 12px;

		> ul {
			width: 100%;
			flex-wrap: unset;

			> li {
				width: 100%;

				> .p-menuitem-content {
					background: transparent;

					&:hover {
						background: transparent;
					}

					> a {
						cursor: default;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.pi-box {
							opacity: 0;
						}

						> span {
							color: white;
						}

						> svg {
							color: white;
							cursor: pointer;
						}
					}
				}

				> .p-megamenu-panel {
					width: 100%;
					margin-top: 10px;

					> ::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;

						background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
						padding: 2px; /* Толщина границы */
						border-radius: 12px; /* Должно совпадать с border-radius кнопки */

						/* Смещаем позади контента */
						z-index: -1;

						/* Обрезаем лишнее, чтобы осталась только рамка */
						-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
						-webkit-mask-composite: xor;
						mask-composite: exclude;
					}

					ul {
						width: 100%;
					}

					.p-megamenu-submenu-header {
						display: none;
					}
				}
			}
		}
	}

	@media (max-width: 960px) {
		.p-megamenu-button {
			display: none !important;
		}

		.p-megamenu-root-list {
			display: flex !important;
		}

		.p-megamenu-panel {
			position: absolute !important;
			width: auto !important;
			background-color: #fff !important;
		}
	}

	@media (max-width: 400px) {
		width: 240px;
	}
`;

export default BookPage;
