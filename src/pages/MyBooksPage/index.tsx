import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { apiRequester } from '../../utils/apiRequester';
import { MY_LIBRARY } from '../../config/urls';
import { IBookInLibrary } from '../../interface/IBookInLibrary';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';

const MyBooksPage = () => {
	const navigate = useNavigate();

	const { isLoading, data } = useQuery<IBookInLibrary[]>({
		queryKey: [`my-books`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBookInLibrary[]>(MY_LIBRARY);

				return response.data.map((i) => ({
					...i,
					authors: i.authors_info.map((i) => i.author_name).join(', '),
					genres: i.genres_info.map((i) => i.genre_name).join(', '),
					readers: i.readers_info.map((i) => i.reader_name).join(', '),
				}));
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	if (isLoading || !data) return null;

	return (
		<Wrapper>
			<PageTitle>Мои книги</PageTitle>
			<WrapperInner>
				<DataTable
					value={data}
					selectionMode='single'
					onSelectionChange={(e) => navigate(routes.book.link(e.value.type, e.value.id || e.value.fantlab_id))}
					removableSort
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
						sortable
						field='genres'
						header='Жанры'
					/>
					<Column
						sortable
						field='readers'
						header='Прочитали'
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
