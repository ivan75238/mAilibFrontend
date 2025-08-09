import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { IBook } from '../../interface/IBook';
import { apiRequester } from '../../utils/apiRequester';
import { FAMILY_GET, GET_BOOK, GET_USERS_IN_FAMILY_WHO_DOSTN_HAVE_BOOK } from '../../config/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../config/routes';
import BookEmptyImageIcon from '../../svg/BookEmptyImageIcon';
import { useMemo, useState } from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';
import AddBookInLibraryModal from './AddBookInLibraryModal';
import { IFamily } from '../../interface/IFamily';
import useUserData from '../../hooks/useUserData';

const BookPage = () => {
	const { id, type } = useParams();
	const navigate = useNavigate();
	const { data: userData } = useUserData();
	const [showMore, setShowMore] = useState(false);
	const [visibleAddModal, setVisibleAddModal] = useState(false);

	if (!id || !type) {
		navigate(routes.main.path);
		return null;
	}

	const { isLoading, data } = useQuery<IBook>({
		queryKey: [`book`, id, type],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBook>(GET_BOOK(type, id));

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const { isLoading: isLoadingFamily, data: familyData } = useQuery<IFamily>({
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

	const { isLoading: isLoadingExistInFamily, data: usersDostnHaveBookInFamily } = useQuery<
		string[]
	>({
		queryKey: [`usersDostnHaveBookInFamily`, id, type],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<string[]>(
					GET_USERS_IN_FAMILY_WHO_DOSTN_HAVE_BOOK(type, id)
				);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
		enabled: !isLoading,
	});

	const bookActions = useMemo(() => {
		if (!data) {
			return [];
		}

		const obj = [
			{
				label: data.is_read_by_user
					? 'Прочитано'
					: data.is_own_by_user
					? 'Добавлено'
					: 'Не добавлено',
				icon: 'pi pi-box',
				items: [
					[
						{
							items: [
								{
									label: 'Добавить в библиотеку',
									disabled: data.is_own_by_user && !usersDostnHaveBookInFamily?.length,
									command: () => setVisibleAddModal(true),
								},
								{
									label: 'Удалить из библиотеки',
									disabled: !data.is_own_by_user,
									command: () => {
										//
									},
								},
								{
									label: 'Отметить как прочитанную',
									disabled: !data.is_read_by_user,
									command: () => {
										//
									},
								},
							],
						},
					],
				],
			},
		] as MenuItem[];

		return obj;
	}, [data, familyData]);

	if (isLoading || !data || isLoadingExistInFamily || isLoadingFamily) return null;

	return (
		<Wrapper>
			<LeftColumn>
				{data.image_big ? (
					<img src={`https://fantlab.ru/${data.image_big}`} />
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
						showMore={showMore}
						dangerouslySetInnerHTML={{
							__html: data.description
								? (data.description || '').replace(/\n/g, '<br>')
								: 'Описание отсутствует',
						}}
					/>
					{data.description && !showMore && (
						<ShowMoreButton onClick={() => setShowMore(true)}>Далее</ShowMoreButton>
					)}
				</DescriptionWrapper>
			</RightColumn>
			{visibleAddModal && (
				<AddBookInLibraryModal
					bookId={id}
					bookType={type}
					usersDostnHaveBookInFamily={usersDostnHaveBookInFamily || []}
					onClose={() => setVisibleAddModal(false)}
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
`;

const RightColumn = styled.div`
	width: calc(100% - 320px);
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const BookNameTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 40px;
	line-height: 49px;
	color: #262626;
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
`;

const DescriptionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const DescriptionHeader = styled.div`
	font-style: normal;
	font-weight: 500;
	font-size: 32px;
	line-height: 39px;
	color: #262626;
`;

const DescriptionText = styled.div<{ showMore: boolean }>`
	font-style: normal;
	font-weight: 300;
	font-size: 26px;
	line-height: 31px;
	text-indent: 16px;
	color: #262626;
	height: ${({ showMore }) => (!showMore ? '287px' : '400px')};

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
`;

const ShowMoreButton = styled.div`
	cursor: pointer;
	font-style: normal;
	font-weight: 400;
	font-size: 28px;
	line-height: 34px;
	color: #bf8afc;
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

				> div {
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
					background: transparent;
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
`;

export default BookPage;
