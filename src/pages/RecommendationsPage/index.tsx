import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { routes } from '../../config/routes';
import {
	BOOKS_RECOMMEND_PERSONAL,
	BOOKS_RECOMMEND_RANDOM,
	BOOKS_RECOMMEND_SIMILAR,
} from '../../config/urls';
import { apiRequester } from '../../utils/apiRequester';

interface IRecommendationBook {
	id?: string;
	fantlab_id?: string;
	name: string;
	image_small?: string;
	image_big?: string;
	authors?: string;
	genres?: string;
	cycles?: string;
	matched_authors?: string;
	matched_genres?: string;
	matched_cycles?: string;
	similarity_score?: number;
	type: 'fantlab_work' | 'fantlab_edition' | 'inner_db_work';
}

interface IPersonalCategory {
	key: string;
	title: string;
	description: string;
	book: IRecommendationBook | null;
}

interface IPersonalResponse {
	categories: IPersonalCategory[];
}

interface ISimilarResponse {
	items: IRecommendationBook[];
}

const RecommendationsPage = () => {
	const navigate = useNavigate();

	const randomMutation = useMutation({
		mutationFn: async () => {
			const response = await apiRequester.get<IRecommendationBook>(BOOKS_RECOMMEND_RANDOM);
			return response.data;
		},
	});

	const personalMutation = useMutation({
		mutationFn: async () => {
			const response = await apiRequester.get<IPersonalResponse>(BOOKS_RECOMMEND_PERSONAL);
			return response.data;
		},
	});

	const similarMutation = useMutation({
		mutationFn: async () => {
			const response = await apiRequester.get<ISimilarResponse>(BOOKS_RECOMMEND_SIMILAR);
			return response.data;
		},
	});

	const randomBook = randomMutation.data;
	const personalCategories = personalMutation.data?.categories || [];
	const similarBooks = similarMutation.data?.items || [];

	const getImageSrc = (book: IRecommendationBook) => {
		const image = book.image_small || book.image_big || '';
		if (!image) return '';
		return book.type === 'inner_db_work' ? image : `https://fantlab.ru/${image}`;
	};

	const goToBook = (book: IRecommendationBook) => {
		navigate(routes.book.link(book.type, book.id || book.fantlab_id || ''));
	};

	const getWhyText = (book: IRecommendationBook) => {
		const parts: string[] = [];
		if (book.matched_authors) parts.push(`авторы: ${book.matched_authors}`);
		if (book.matched_genres) parts.push(`жанры: ${book.matched_genres}`);
		if (book.matched_cycles) parts.push(`циклы: ${book.matched_cycles}`);
		return parts.join(' | ');
	};

	return (
		<Wrapper>
			<PageTitle>Рекомендации</PageTitle>
			<ButtonsRow>
				<Button
					width={220}
					height={44}
					label='Случайная'
					loading={randomMutation.isPending}
					onClick={async () => {
						personalMutation.reset();
						similarMutation.reset();
						await randomMutation.mutateAsync();
					}}
				/>
				<Button
					width={220}
					height={44}
					label='Персональная'
					outlined
					loading={personalMutation.isPending}
					onClick={async () => {
						randomMutation.reset();
						similarMutation.reset();
						await personalMutation.mutateAsync();
					}}
				/>
				<Button
					width={220}
					height={44}
					label='По похожести'
					outlined
					loading={similarMutation.isPending}
					onClick={async () => {
						randomMutation.reset();
						personalMutation.reset();
						await similarMutation.mutateAsync();
					}}
				/>
			</ButtonsRow>

			<ResultsBlock>
				{randomBook && (
					<Section>
						<SectionTitle>Случайная рекомендация</SectionTitle>
						<BookCard onClick={() => goToBook(randomBook)}>
							<CoverWrapper>
								{getImageSrc(randomBook) ? (
									<img src={getImageSrc(randomBook)} alt={randomBook.name} />
								) : (
									<CoverPlaceholder />
								)}
							</CoverWrapper>
							<BookInfo>
								<BookName>{randomBook.name}</BookName>
								<BookMeta>Автор: {randomBook.authors || 'Не указан'}</BookMeta>
								<BookMeta>Жанр: {randomBook.genres || 'Не указан'}</BookMeta>
							</BookInfo>
						</BookCard>
					</Section>
				)}

				{!!personalCategories.length && (
					<Section>
						<SectionTitle>Персональные рекомендации</SectionTitle>
						<CategoriesGrid>
							{personalCategories.map((category) => (
								<CategoryCard key={category.key}>
									<CategoryTitle>{category.title}</CategoryTitle>
									<CategoryDescription>{category.description}</CategoryDescription>
									{(() => {
										const book = category.book;
										if (!book) {
											return <EmptyText>Нет подходящей книги в этой категории</EmptyText>;
										}

										const imageSrc = getImageSrc(book);

										return (
											<BookCard onClick={() => goToBook(book)}>
												<CoverWrapper>
													{imageSrc ? (
														<img src={imageSrc} alt={book.name} />
													) : (
														<CoverPlaceholder />
													)}
												</CoverWrapper>
												<BookInfo>
													<BookName>{book.name}</BookName>
													<BookMeta>Автор: {book.authors || 'Не указан'}</BookMeta>
													<BookMeta>Жанр: {book.genres || 'Не указан'}</BookMeta>
												</BookInfo>
											</BookCard>
										);
									})()}
								</CategoryCard>
							))}
						</CategoriesGrid>
					</Section>
				)}

				{!!similarBooks.length && (
					<Section>
						<SectionTitle>Похожие к вашим прочитанным</SectionTitle>
						<CardsList>
							{similarBooks.map((book, index) => {
								const imageSrc = getImageSrc(book);
								const cardKey = `${book.type}-${book.id || book.fantlab_id || index}`;
								return (
									<BookCard key={cardKey} onClick={() => goToBook(book)}>
										<CoverWrapper>
											{imageSrc ? (
												<img src={imageSrc} alt={book.name} />
											) : (
												<CoverPlaceholder />
											)}
										</CoverWrapper>
										<BookInfo>
											<BookName>{book.name}</BookName>
											<BookMeta>Автор: {book.authors || 'Не указан'}</BookMeta>
											<BookMeta>Жанр: {book.genres || 'Не указан'}</BookMeta>
											{getWhyText(book) && <WhyText>Почему: {getWhyText(book)}</WhyText>}
										</BookInfo>
									</BookCard>
								);
							})}
						</CardsList>
					</Section>
				)}

				{!randomBook && !personalCategories.length && !similarBooks.length && (
					<PlaceholderText>Выберите тип рекомендации выше</PlaceholderText>
				)}
			</ResultsBlock>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	height: calc(100% - 70px);
	display: flex;
	flex-direction: column;
	padding: 52px 64px;
	gap: 24px;

	@media (max-width: 640px) {
		padding: 24px 16px;
	}
`;

const PageTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 36px;
	line-height: 44px;
	color: #262626;
`;

const ButtonsRow = styled.div`
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
`;

const ResultsBlock = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const SectionTitle = styled.div`
	font-size: 20px;
	font-weight: 500;
	color: #262626;
`;

const CategoriesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 12px;
`;

const CardsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const CategoryCard = styled.div`
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const CategoryTitle = styled.div`
	font-size: 16px;
	font-weight: 500;
	color: #262626;
`;

const CategoryDescription = styled.div`
	font-size: 13px;
	color: #6b7280;
`;

const BookCard = styled.div`
	border: 1px solid #d1d5db;
	border-radius: 8px;
	padding: 10px;
	display: flex;
	gap: 10px;
	cursor: pointer;
`;

const CoverWrapper = styled.div`
	width: 40px;
	height: 56px;
	flex: 0 0 auto;
	border-radius: 4px;
	overflow: hidden;
	background: #f3f4f6;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`;

const CoverPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #e5e7eb, #f3f4f6);
`;

const BookInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
`;

const BookName = styled.div`
	font-size: 15px;
	font-weight: 500;
	color: #262626;
`;

const BookMeta = styled.div`
	font-size: 13px;
	color: #4b5563;
`;

const WhyText = styled.div`
	font-size: 12px;
	color: #6b7280;
`;

const EmptyText = styled.div`
	font-size: 13px;
	color: #6b7280;
`;

const PlaceholderText = styled.div`
	font-size: 14px;
	color: #6b7280;
`;

export default RecommendationsPage;
