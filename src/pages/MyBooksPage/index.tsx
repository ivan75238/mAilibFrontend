import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { apiRequester } from '../../utils/apiRequester';
import { MY_LIBRARY } from '../../config/urls';
import { IBookInLibrary } from '../../interface/IBookInLibrary';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const MyBooksPage = () => {
	const { isLoading, data } = useQuery<IBookInLibrary[]>({
		queryKey: [`my-books`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBookInLibrary[]>(MY_LIBRARY);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const authorBodyTemplate = (item: IBookInLibrary) => {
		return item.authors_info.map((i) => i.author_name).join(', ');
	};

	const jenresBodyTemplate = (item: IBookInLibrary) => {
		return item.genres_info.map((i) => i.genre_name).join(', ');
	};

	const readersBodyTemplate = (item: IBookInLibrary) => {
		return item.readers_info.map((i) => i.reader_name).join(', ');
	};

	if (isLoading || !data) return null;

	return (
		<Wrapper>
			<PageTitle>Мои книги</PageTitle>
			<WrapperInner>
				<DataTable
					value={data}
					selectionMode='single'
					scrollable
					scrollHeight='100%'
					tableStyle={{ width: '100%' }}>
					<Column
						field='name'
						header='Название'
					/>
					<Column
						field='author'
						header='Автор'
						body={authorBodyTemplate}
					/>
					<Column
						field='janres'
						header='Жанры'
						body={jenresBodyTemplate}
					/>
					<Column
						field='date'
						header='Прочитали'
						body={readersBodyTemplate}
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
