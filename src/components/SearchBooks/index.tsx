import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { apiRequester } from '../../utils/apiRequester';
import { BOOKS_SEARCH } from '../../config/urls';
import { generalStore } from '../../stores/generalStore';
import { IBook } from '../../interface/IBook';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import SeachIcon from '../../svg/SeachIcon';

const SearchBooks = observer(() => {
	const [books, setBooks] = useState<IBook[]>([]);
	const [value, setValue] = useState('');
	const navigate = useNavigate();

	const itemTemplate = useCallback((item: IBook) => {
		return (
			<ItemWrapper>
				«{item.name}» {item.authors.map((i) => i.name).join(', ')}
			</ItemWrapper>
		);
	}, []);

	const mutation = useMutation({
		mutationFn: (searchString: string) => {
			return apiRequester.get<IBook[]>(`${BOOKS_SEARCH}?q=${searchString}`);
		},
	});

	const search = useCallback(async (event: AutoCompleteCompleteEvent) => {
		try {
			const response = await mutation.mutateAsync(event.query.toLowerCase());
			setBooks(response.data);
		} catch (e) {
			generalStore.showError('Ошибка поиска, попробуйте позже или обратитеся в тех. поддержку');
		}
	}, []);

	return (
		<MainWrapper>
			<IconWrapper>
				<SeachIcon />
			</IconWrapper>
			<AutoComplete
				field='name'
				suggestions={books}
				completeMethod={search}
				onSelect={(e) => navigate(routes.book.link(e.value.id || e.value.fantlab_id))}
				itemTemplate={itemTemplate}
				placeholder={'Поиск'}
				minLength={3}
				value={value}
				inputClassName='search-input'
				onChange={(e) => setValue(typeof e.value === 'string' ? e.value : '')}
			/>
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	align-items: center;
	position: relative;

	.search-input {
		width: 532px;
		padding-left: 38px;
		height: 40px;
		border-radius: 12px;
	}
`;

const IconWrapper = styled.div`
	position: absolute;
	z-index: 2;
	left: 12px;
	height: 20px;
`;

const ItemWrapper = styled.div`
	display: block;
	padding: 10px 0px;
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	color: #262626;
	max-width: 480px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export default SearchBooks;
