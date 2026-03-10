import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useAnalyticsData from '../../hooks/useAnalyticsData';
import useFamilyRecentReads from '../../hooks/useFamilyRecentReads';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';

const AnalyticsPage = observer(() => {
	const { data: familyAnaliticsData, isLoading: isLoadingFamilyAnaliticsData } =
		useAnalyticsData();
	const { data: recentReadsData } = useFamilyRecentReads();
	const navigate = useNavigate();

	if (isLoadingFamilyAnaliticsData) return null;

	return (
		<Wrapper>
			<PageTitle>Аналитика</PageTitle>
			<CardsWrapper>
				{familyAnaliticsData?.map((item) => {
					const recent = recentReadsData?.find((r) => r.member_id === item.member_id);
					return (
						<CardWrapper key={item.member_id}>
							<Name>
								{item.first_name} {item.last_name}
							</Name>
							<Param>
								Всего книг: <b>{item.books_owned_count}</b>
							</Param>
							<Param>
								Прочитано: <b>{item.books_read_count}</b>
							</Param>
							<Param>
								Процент: <b>{item.read_percentage}</b>
							</Param>
							<RecentBlock>
								<RecentTitle>Последние прочитанные</RecentTitle>
								{recent?.recent_reads?.length ? (
									<RecentList>
										{recent.recent_reads.map((book) => (
											<RecentItem
												key={`${item.member_id}-${book.book_id}-${book.read_date}`}
												onClick={() =>
													navigate(
														routes.book.link(
															book.type,
															book.book_id || book.fantlab_id || ''
														)
													)
												}
												role='button'
												tabIndex={0}>
												<RecentLeft>
													<RecentCover>
														{book.image_small ? (
															book.type === 'inner_db_work' ? (
																<img src={book.image_small} alt={book.name} />
															) : (
																<img
																	src={`https://fantlab.ru/${book.image_small}`}
																	alt={book.name}
																/>
															)
														) : (
															<RecentCoverPlaceholder />
														)}
													</RecentCover>
													<span>{book.name}</span>
												</RecentLeft>
												<SmallDate>
													{new Date(book.read_date).toLocaleDateString('ru-RU')}
												</SmallDate>
											</RecentItem>
										))}
									</RecentList>
								) : (
									<RecentEmpty>Нет прочитанных книг</RecentEmpty>
								)}
							</RecentBlock>
						</CardWrapper>
					);
				})}
			</CardsWrapper>
		</Wrapper>
	);
});

const CardsWrapper = styled.div`
	width: 100%;
	display: flex;
	gap: 16px;
	flex-wrap: wrap;
`;

const CardWrapper = styled.div`
	width: 260px;
	display: flex;
	flex-direction: column;
	padding: 16px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	gap: 8px;
`;

const Name = styled.div`
	font-weight: 400;
	font-size: 16px;
	color: #262626;
`;

const Param = styled.div`
	font-weight: 400;
	font-size: 14px;
	color: #262626;
`;

const RecentBlock = styled.div`
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const RecentTitle = styled.div`
	font-weight: 500;
	font-size: 14px;
	color: #262626;
`;

const RecentList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const RecentItem = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 8px;
	font-size: 13px;
	color: #262626;
	cursor: pointer;
`;

const RecentLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
`;

const RecentCover = styled.div`
	width: 28px;
	height: 36px;
	flex: 0 0 auto;
	border-radius: 3px;
	overflow: hidden;
	background: #f3f4f6;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`;

const RecentCoverPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #e5e7eb, #f3f4f6);
`;

const SmallDate = styled.span`
	color: #6b7280;
	font-size: 12px;
	white-space: nowrap;
`;

const RecentEmpty = styled.div`
	color: #6b7280;
	font-size: 12px;
`;

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

export default AnalyticsPage;
