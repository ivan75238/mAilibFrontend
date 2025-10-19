import styled from 'styled-components';
import { DataTable, DataTableStateEvent, SortOrder } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import useMyBooksData from '../../hooks/useMyBooksData';
import { useState } from 'react';

const MyBooksPage = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(20);
	const [sortField, setSortField] = useState('name');
	const [sortOrder, setSortOrder] = useState<SortOrder>(1);

	const { isLoading, data } = useMyBooksData(page, limit, sortField, sortOrder);

	const onSort = (event: DataTableStateEvent) => {
		setSortField(event.sortField);
		setSortOrder(event.sortOrder);
	};

	return (
		<Wrapper>
			<PageTitle>Мои книги</PageTitle>
			<WrapperInner>
				{!isLoading && data && (
					<DataTable
						value={data.data}
						selectionMode='single'
						onSelectionChange={(e) =>
							navigate(routes.book.link(e.value.type, e.value.id || e.value.fantlab_id))
						}
						removableSort
						onSort={onSort}
						sortField={sortField}
						sortOrder={sortOrder}
						scrollable
						scrollHeight='100%'
						tableStyle={{ width: '100%' }}>
						<Column
							sortable
							field='name'
							header='Название'
						/>
						<Column
							sortable
							field='authors'
							header='Автор'
						/>
						<Column
							field='genres'
							header='Жанры'
						/>
						<Column
							field='readers'
							header='Прочитали'
						/>
					</DataTable>
				)}
			</WrapperInner>
			<AnaliticBlock>
				<ParamBlock>
					<span>Всего:</span>
					<b>{!isLoading && data && data.pagination.total_items}</b>
				</ParamBlock>
				<Paginator
					first={page * limit}
					rows={limit}
					totalRecords={!isLoading && data ? data.pagination.total_items : 0}
					rowsPerPageOptions={[10, 20, 30]}
					onPageChange={({ rows, page }) => {
						setPage(page);
						setLimit(rows);
					}}
				/>
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

	@media (max-width: 400px) {
		padding: 52px 8px;
	}
`;

const WrapperInner = styled.div`
	width: 100%;
	height: calc(100% - 55px);
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
	justify-content: space-between;
	margin-top: 16px;
`;

const ParamBlock = styled.div`
	gap: 8px;
	display: flex;
	align-items: center;
`;

export default MyBooksPage;
