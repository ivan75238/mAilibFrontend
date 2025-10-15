import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import useMyBooksData from '../../hooks/useMyBooksData';

const MyBooksPage = () => {
	const navigate = useNavigate();

	const { isLoading, data } = useMyBooksData();

	if (isLoading || !data) return null;

	return (
		<Wrapper>
			<PageTitle>Мои книги</PageTitle>
			<WrapperInner>
				<DataTable
					value={data}
					selectionMode='single'
					onSelectionChange={(e) =>
						navigate(routes.book.link(e.value.type, e.value.id || e.value.fantlab_id))
					}
					removableSort
					scrollable
					scrollHeight='100%'
					tableStyle={{ width: '100%' }}>
					<Column
						sortable
						field='name'
						header='Название'
						filter
					/>
					<Column
						sortable
						field='authors'
						header='Автор'
						filter
					/>
					<Column
						sortable
						field='genres'
						header='Жанры'
						filter
					/>
					<Column
						sortable
						field='readers'
						header='Прочитали'
						filter
					/>
				</DataTable>
			</WrapperInner>
			<AnaliticBlock>
				<ParamBlock>
					<span>Всего:</span>
					<b>{data.length}</b>
				</ParamBlock>
			</AnaliticBlock>
		</Wrapper>
	);
};

const PageTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 36px;
	line-height: 44px;
	color: #262626;
	padding-bottom: 28px;

	@media (max-width: 400px) {
		font-size: 30px;
		text-align: center;
	}
`;

const Wrapper = styled.div`
	width: 100%;
	height: calc(100% - 40px);
	flex-direction: column;
	display: flex;
	padding: 52px 64px;

	> div {
		width: 100%;
	}
`;

const WrapperInner = styled.div`
	width: 100%;
	height: calc(100% - 40px);
	gap: 54px;
	display: flex;

	> div {
		width: 100%;
	}
`;

const AnaliticBlock = styled.div`
	width: 100%;
	height: 40px;
	gap: 16px;
	display: flex;
	align-items: center;
	margin-top: 16px;
`;

const ParamBlock = styled.div`
	gap: 8px;
	display: flex;
	align-items: center;
`;

export default MyBooksPage;
