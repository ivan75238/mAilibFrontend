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
import { ISearchResult } from '../../interface/ISearchResult';
import { ISearchResultGroup } from '../../interface/ISearchResultGroup';
import BookEmptyImageIcon from '../../svg/BookEmptyImageIcon';

const SearchBooks = observer(() => {
	const [results, setResults] = useState<ISearchResultGroup[]>();
	const [value, setValue] = useState('');
	const navigate = useNavigate();

	const itemTemplate = useCallback((item: IBook) => {
		if (item.id === '-1') {
			return <ItemWrapper>Ничего не найдено</ItemWrapper>;
		}

		return (
			<ItemWrapper>
				{item.image_small || item.image_big ? (
					<img src={`https://fantlab.ru/${item.image_small}`} />
				) : (
					<EmptyImageWrapper>
						<BookEmptyImageIcon />
					</EmptyImageWrapper>
				)}
				<span>
					«{item.name}» {item.authors.map((i) => i.name).join(', ')}
				</span>
			</ItemWrapper>
		);
	}, []);

	const mutation = useMutation({
		mutationFn: (searchString: string) => {
			return apiRequester.get<ISearchResult>(`${BOOKS_SEARCH}?q=${searchString}`);
		},
	});

	const search = useCallback(async (event: AutoCompleteCompleteEvent) => {
		try {
			const response = await mutation.mutateAsync(event.query.toLowerCase());
			if (response.data.books.length || response.data.books.length) {
				const groups: ISearchResultGroup[] = [
					{
						label: 'Произведения',
						code: 'fantlab_works',
						items: response.data.books,
					},
					{
						label: 'Издания',
						code: 'fantlab_edition',
						items: response.data.editions,
					},
				];
				setResults(groups);
			} else {
				setResults([
					{
						label: 'Ничего не найдено',
						code: 'empty',
						items: [],
					},
				]);
			}
		} catch (e) {
			generalStore.showError('Ошибка поиска, попробуйте позже или обратитеся в тех. поддержку');
		}
	}, []);

	const groupedItemTemplate = (item: ISearchResultGroup) => {
		return (
			<div className='flex align-items-center'>
				<div>{item.label}</div>
			</div>
		);
	};

	return (
		<MainWrapper>
			<IconWrapper>
				<SeachIcon />
			</IconWrapper>
			{
				//@ts-ignore
				<AutoComplete
					field='name'
					suggestions={results}
					completeMethod={search}
					itemTemplate={itemTemplate}
					onSelect={(e) => {
						const val = e.value as unknown as IBook;

						val.id !== '-1' && navigate(routes.book.link(val.type, val.id || val.fantlab_id));
					}}
					placeholder={'Поиск'}
					minLength={3}
					value={value}
					inputClassName='search-input'
					onChange={(e) => setValue(typeof e.value === 'string' ? e.value : '')}
					optionGroupLabel='label'
					optionGroupChildren='items'
					optionGroupTemplate={groupedItemTemplate}
				/>
			}
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
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 0px;
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	color: #262626;
	max-width: 480px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	img {
		height: 60px;
	}
`;

const EmptyImageWrapper = styled.div`
	width: 38px;
	height: 60px;
	background: #e4cffd;
	border-radius: 8px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		position: absolute;
		top: 22px;
		width: 20px;
		height: auto;
	}
`;

export default SearchBooks;
