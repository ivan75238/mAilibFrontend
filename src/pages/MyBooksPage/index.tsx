import styled from 'styled-components';
import { DataTable, DataTableStateEvent, SortOrder } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import useMyBooksData from '../../hooks/useMyBooksData';
import { useEffect, useState } from 'react';

const MyBooksPage = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(20);
	const [sortField, setSortField] = useState('name');
	const [sortOrder, setSortOrder] = useState<SortOrder>(1);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');

	useEffect(() => {
		if (searchInput.length < 3) {
			setSearch('');
			setPage(0);
			return;
		}

		const id = setTimeout(() => {
			setSearch(searchInput);
			setPage(0);
		}, 300);

		return () => clearTimeout(id);
	}, [searchInput]);

	const { isLoading, data } = useMyBooksData(page, limit, sortField, sortOrder, search);

	const onSort = (event: DataTableStateEvent) => {
		setSortField(event.sortField);
		setSortOrder(event.sortOrder);
	};

	return (
		<Wrapper>
			<Header>
				<PageTitle>Мои книги</PageTitle>
				<SearchRow>
					<SearchLabel htmlFor='my-books-search'>
						Поиск по названию, автору, жанру
					</SearchLabel>
					<InputText
						id='my-books-search'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder='Введите минимум 3 символа'
					/>
				</SearchRow>
			</Header>
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
						<Column sortable field='name' header='Название' />
						<Column sortable field='authors' header='Автор' />
						<Column field='genres' header='Жанры' />
						<Column field='readers' header='Прочитали' />
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
	padding-bottom: 20px;

	@media (max-width: 400px) {
		font-size: 30px;
		text-align: center;
	}
`;

const SearchRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 24px;

	input {
		width: 100%;
		max-width: 520px;
	}
`;

const SearchLabel = styled.label`
	font-size: 16px;
	color: #262626;
`;

const Header = styled.label`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;

	@media (max-width: 400px) {
		flex-direction: column;
	}
`;

const Wrapper = styled.div`
	width: 100%;
	height: calc(100% - 70px);
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
