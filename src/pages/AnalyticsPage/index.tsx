import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useAnalyticsData from '../../hooks/useAnalyticsData';

const AnalyticsPage = observer(() => {
	const { data: familyAnaliticsData, isLoading: isLoadingFamilyAnaliticsData } = useAnalyticsData();

	if (isLoadingFamilyAnaliticsData) return null;

	return (
		<Wrapper>
			<PageTitle>Аналитика</PageTitle>
			<CardsWrapper>
				{familyAnaliticsData?.map((item) => {
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
	width: 200px;
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
