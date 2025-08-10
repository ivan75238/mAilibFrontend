import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { AUTHORS_ALL, BOOKS_BOOK_CREATE, CYCLES_ALL, GENRES_ALL } from '../../config/urls';
import Button from '../Button';
import { errorsDescriptions } from '../../config/errors';
import Input from '../Input';
import IAuthor from '../../interface/IAuthor';
import Textarea from '../Textarea';
import {
	AutoComplete,
	AutoCompleteCompleteEvent,
	AutoCompleteSelectEvent,
} from 'primereact/autocomplete';
import IGenre from '../../interface/IGenre';
import ICycle from '../../interface/ICycle';
import { routes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';

interface IFormData {
	name: string;
	description?: string;
	image?: string;
	isbn?: string;
	authors?: {
		name?: string | undefined;
		id?: string | undefined;
	}[];
	genres?: {
		name?: string | undefined;
		id?: string | undefined;
	}[];
	cycles?:
		| {
				name?: string | undefined;
				id?: string | undefined;
		  }[]
		| null;
}

const schema = yup.object().shape({
	name: yup
		.string()
		.required(errorsDescriptions.required)
		.min(1, `${errorsDescriptions.minLength} 1`),
	description: yup.string(),
	image: yup.string(),
	isbn: yup.string(),
	authors: yup.array().of(
		yup.object().shape({
			id: yup.string(),
			name: yup.string(),
		})
	),
	genres: yup.array().of(
		yup.object().shape({
			id: yup.string(),
			name: yup.string(),
		})
	),
	cycles: yup
		.array()
		.of(
			yup.object().shape({
				id: yup.string(),
				name: yup.string(),
			})
		)
		.nullable(),
});

interface IProps {
	onClose: () => void;
}

const AddNewBookInDbModal = ({ onClose }: IProps) => {
	const navigate = useNavigate();
	const [manualAuthorName, setManualAuthorName] = useState('');
	const [searchAuthorName, setSearchAuthorName] = useState('');
	const [authorsSearched, setAuthorsSearched] = useState<IAuthor[]>([]);
	const [manualGenreName, setManualGenreName] = useState('');
	const [searchGenreName, setSearchGenreName] = useState('');
	const [genresSearched, setGenresSearched] = useState<IGenre[]>([]);
	const [manualCycleName, setManualCycleName] = useState('');
	const [searchCycleName, setSearchCycleName] = useState('');
	const [cyclesSearched, setCyclesSearched] = useState<ICycle[]>([]);

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(schema),
	});

	const selectedAuthors = watch('authors');
	const selectedGenres = watch('genres');
	const selectedCycles = watch('cycles');

	const { data: authors } = useQuery<IAuthor[]>({
		queryKey: [`authors`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IAuthor[]>(AUTHORS_ALL);
				setAuthorsSearched(response.data);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const { data: genres } = useQuery<IGenre[]>({
		queryKey: [`genres`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IAuthor[]>(GENRES_ALL);
				setGenresSearched(response.data);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const { data: cycles } = useQuery<ICycle[]>({
		queryKey: [`cycles`],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IAuthor[]>(CYCLES_ALL);
				setCyclesSearched(response.data);

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			return apiRequester.post(BOOKS_BOOK_CREATE, formData);
		},
		onSuccess: (response) => {
			navigate(routes.book.link('inner_db_work', response.data.bookId));
			onClose();
		},
	});

	const onSave = useCallback((formData: IFormData) => {
		mutation.mutate(formData);
	}, []);

	const onSelectAuthor = useCallback(
		(e: AutoCompleteSelectEvent) => {
			const author = { id: e.value.id, name: e.value.name };
			if (selectedAuthors) {
				setValue('authors', [...selectedAuthors, author]);
			} else {
				setValue('authors', [author]);
			}
			setSearchAuthorName('');
		},
		[selectedAuthors]
	);

	const addNewAuthor = useCallback(() => {
		const author = { id: undefined, name: manualAuthorName };
		if (selectedAuthors) {
			setValue('authors', [...selectedAuthors, author]);
		} else {
			setValue('authors', [author]);
		}
	}, [manualAuthorName, selectedAuthors]);

	const onAuthorDelete = useCallback(
		(author: { name?: string | undefined; id?: string | undefined }) => {
			if (selectedAuthors) {
				const result = selectedAuthors.filter((i) => i.id !== author.id && i.name !== author.name);
				setValue('authors', result);
			}
		},
		[selectedAuthors]
	);

	const searchAuthors = (event: AutoCompleteCompleteEvent) => {
		if (authors) {
			const result = authors.filter(
				(i) => i.name.toUpperCase().indexOf(event.query.toUpperCase()) > -1
			);
			setAuthorsSearched(result);
		}
	};

	const onSelectGenre = useCallback(
		(e: AutoCompleteSelectEvent) => {
			const genre = { id: e.value.id, name: e.value.name };
			if (selectedGenres) {
				setValue('genres', [...selectedGenres, genre]);
			} else {
				setValue('genres', [genre]);
			}
			setSearchGenreName('');
		},
		[selectedGenres]
	);

	const addNewGenre = useCallback(() => {
		const genre = { id: undefined, name: manualGenreName };
		if (selectedGenres) {
			setValue('genres', [...selectedGenres, genre]);
		} else {
			setValue('genres', [genre]);
		}
	}, [manualGenreName, selectedGenres]);

	const onGenreDelete = useCallback(
		(genre: { name?: string | undefined; id?: string | undefined }) => {
			if (selectedGenres) {
				const result = selectedGenres.filter((i) => i.id !== genre.id && i.name !== genre.name);
				setValue('genres', result);
			}
		},
		[selectedGenres]
	);

	const searchGenres = (event: AutoCompleteCompleteEvent) => {
		if (genres) {
			const result = genres.filter(
				(i) => i.name.toUpperCase().indexOf(event.query.toUpperCase()) > -1
			);
			setGenresSearched(result);
		}
	};

	const onSelectCycle = useCallback(
		(e: AutoCompleteSelectEvent) => {
			const cycle = { id: e.value.id, name: e.value.name };
			if (selectedCycles) {
				setValue('cycles', [...selectedCycles, cycle]);
			} else {
				setValue('cycles', [cycle]);
			}
			setSearchCycleName('');
		},
		[selectedCycles]
	);

	const addNewCycle = useCallback(() => {
		const cycle = { id: undefined, name: manualCycleName };
		if (selectedCycles) {
			setValue('cycles', [...selectedCycles, cycle]);
		} else {
			setValue('cycles', [cycle]);
		}
	}, [manualCycleName, selectedCycles]);

	const onCycleDelete = useCallback(
		(cycle: { name?: string | undefined; id?: string | undefined }) => {
			if (selectedCycles) {
				const result = selectedCycles.filter((i) => i.id !== cycle.id && i.name !== cycle.name);
				setValue('cycles', result);
			}
		},
		[selectedCycles]
	);

	const searchCycles = (event: AutoCompleteCompleteEvent) => {
		if (cycles) {
			const result = cycles.filter(
				(i) => i.name.toUpperCase().indexOf(event.query.toUpperCase()) > -1
			);
			setCyclesSearched(result);
		}
	};

	console.log('manualAuthorName', manualAuthorName);

	return (
		<Dialog
			header='Добавление новой книги'
			visible={true}
			style={{ width: '650px' }}
			onHide={onClose}>
			<FormWrapper>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								placeholder={'Название'}
								invalid={!!errors?.name?.message}
								errorText={errors?.name?.message}
							/>
						);
					}}
					name='name'
					control={control}
				/>
				<SelectorWrapper>
					<AutoComplete
						suggestions={authorsSearched}
						completeMethod={searchAuthors}
						onSelect={onSelectAuthor}
						value={searchAuthorName}
						onChange={(e) => setSearchAuthorName(e.value)}
						placeholder='Выберите автора'
						field='name'
					/>
					<span>или</span>
					<ManualInputWrapper>
						<Input
							value={manualAuthorName}
							onChange={(e) => setManualAuthorName(e.target.value)}
							placeholder={'Введите ФИО автора'}
						/>
						<AddIcon onClick={manualAuthorName ? addNewAuthor : undefined}>
							<i className='pi pi-plus' />
						</AddIcon>
					</ManualInputWrapper>
				</SelectorWrapper>
				{!selectedAuthors ? null : (
					<Items>
						{selectedAuthors.map((author) => {
							return (
								<Item key={author.id}>
									<UserName>{author.name}</UserName>
									<i
										className='pi pi-times'
										onClick={() => onAuthorDelete(author)}
									/>
								</Item>
							);
						})}
					</Items>
				)}
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Textarea
								{...field}
								{...fieldState}
								placeholder={'Описание'}
								invalid={!!errors?.description?.message}
								errorText={errors?.description?.message}
							/>
						);
					}}
					name='description'
					control={control}
				/>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								placeholder={'Ссылка на изображение'}
								invalid={!!errors?.image?.message}
								errorText={errors?.image?.message}
							/>
						);
					}}
					name='image'
					control={control}
				/>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								placeholder={'ISBN'}
								invalid={!!errors?.isbn?.message}
								errorText={errors?.isbn?.message}
							/>
						);
					}}
					name='isbn'
					control={control}
				/>
				<SelectorWrapper>
					<AutoComplete
						suggestions={genresSearched}
						completeMethod={searchGenres}
						onSelect={onSelectGenre}
						value={searchGenreName}
						onChange={(e) => setSearchGenreName(e.value)}
						placeholder='Выберите жанр'
						field='name'
					/>
					<span>или</span>
					<ManualInputWrapper>
						<Input
							value={manualGenreName}
							onChange={(e) => setManualGenreName(e.target.value)}
							placeholder={'Введите название жанра'}
						/>
						<AddIcon onClick={manualGenreName ? addNewGenre : undefined}>
							<i className='pi pi-plus' />
						</AddIcon>
					</ManualInputWrapper>
				</SelectorWrapper>
				{!selectedGenres ? null : (
					<Items>
						{selectedGenres.map((genre) => {
							return (
								<Item key={genre.id}>
									<UserName>{genre.name}</UserName>
									<i
										className='pi pi-times'
										onClick={() => onGenreDelete(genre)}
									/>
								</Item>
							);
						})}
					</Items>
				)}
				<SelectorWrapper>
					<AutoComplete
						suggestions={cyclesSearched}
						completeMethod={searchCycles}
						onSelect={onSelectCycle}
						value={searchCycleName}
						onChange={(e) => setSearchCycleName(e.value)}
						placeholder='Выберите цикл'
						field='name'
					/>
					<span>или</span>
					<ManualInputWrapper>
						<Input
							value={manualCycleName}
							onChange={(e) => setManualCycleName(e.target.value)}
							placeholder={'Введите название цикла'}
						/>
						<AddIcon onClick={manualCycleName ? addNewCycle : undefined}>
							<i className='pi pi-plus' />
						</AddIcon>
					</ManualInputWrapper>
				</SelectorWrapper>
				{!selectedCycles ? null : (
					<Items>
						{selectedCycles.map((cycle) => {
							return (
								<Item key={cycle.id}>
									<UserName>{cycle.name}</UserName>
									<i
										className='pi pi-times'
										onClick={() => onCycleDelete(cycle)}
									/>
								</Item>
							);
						})}
					</Items>
				)}
				<Button
					label={'Добавить'}
					onClick={handleSubmit(onSave)}
				/>
			</FormWrapper>
		</Dialog>
	);
};

const FormWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 16px;
	width: 100%;

	.w-full {
		width: 100%;
	}
`;

const SelectorWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;

	> div {
		width: calc(50% - 24px);
	}

	> span:first-child {
		width: calc(50% - 24px);

		input {
			width: 100%;
		}
	}
`;

const ManualInputWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	> div:first-child {
		width: 223px;
		min-width: 223px;
	}
`;

const Items = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	width: 100%;
`;

const AddIcon = styled.div`
	cursor: pointer;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	height: 46px;
	min-width: 46px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Item = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	i {
		cursor: pointer;
	}
`;

const UserName = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	color: #262626;
`;

export default AddNewBookInDbModal;
