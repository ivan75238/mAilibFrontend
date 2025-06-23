import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { IBook } from '../../interface/IBook';
import { apiRequester } from '../../utils/apiRequester';
import { GET_BOOK } from '../../config/urls';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../config/routes';
import BookEmptyImageIcon from '../../svg/BookEmptyImageIcon';
import Button from '../../components/Button';
import { useState } from 'react';

const BookPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [showMore, setShowMore] = useState(false);

	if (!id) {
		navigate(routes.main.path);
		return null;
	}

	const { isLoading, data } = useQuery<IBook>({
		queryKey: [`book`, id],
		queryFn: async () => {
			try {
				const response = await apiRequester.get<IBook>(GET_BOOK(id));

				return response.data;
			} catch (e) {
				throw new Error('Не удалось получить данные');
			}
		},
	});

	if (isLoading || !data) return null;

	console.log('data.image_big', data);

	return (
		<Wrapper>
			<LeftColumn>
				{data.image_big ? (
					<img src={`https://fantlab.ru/${data.image_big}`} />
				) : (
					<EmptyImageWrapper>
						<BookEmptyImageIcon />
						<p>{data.name}</p>
					</EmptyImageWrapper>
				)}
				<Button
					label={'Добавить'}
					onClick={() => null}
					height={60}
				/>
			</LeftColumn>
			<RightColumn>
				<BookNameTitle>{data.name}</BookNameTitle>
				<AuthorAndCyclesWrapper>
					<p>
						Автор: <span>{data.authors.map((i) => i.name).join(', ')}</span>
					</p>
					<p>
						Входит в серию: <span>{data.cycles.map((i) => i.name).join(', ')}</span>
					</p>
				</AuthorAndCyclesWrapper>
				<DescriptionWrapper>
					<DescriptionHeader>О книге</DescriptionHeader>
					<DescriptionText
						showMore={showMore}
						dangerouslySetInnerHTML={{ __html: (data.description || '').replace(/\n/g, '<br>') }}
					/>
					{!showMore && <ShowMoreButton onClick={() => setShowMore(true)}>Далее</ShowMoreButton>}
				</DescriptionWrapper>
			</RightColumn>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	gap: 54px;
	display: flex;
	padding: 52px 64px;
`;

const LeftColumn = styled.div`
	width: 320px;
	flex-direction: column;
	display: flex;
	gap: 36px;

	img {
		width: 320px;
		height: 507px;
		filter: drop-shadow(0px 0px 12px rgba(19, 0, 32, 0.25));
		border-radius: 8px;
	}
`;

const EmptyImageWrapper = styled.div`
	width: 320px;
	height: 507px;
	background: #e4cffd;
	border-radius: 8px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		position: absolute;
		top: 100px;
	}

	p {
		position: absolute;
		top: 270px;
		font-style: normal;
		font-weight: 500;
		font-size: 24px;
		text-align: center;
		color: #743bb1;
	}
`;

const RightColumn = styled.div`
	width: calc(100% - 320px);
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const BookNameTitle = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 40px;
	line-height: 49px;
	color: #262626;
`;

const AuthorAndCyclesWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	font-style: normal;
	font-weight: 400;
	font-size: 28px;
	line-height: 34px;
	color: #818181;

	p {
		margin: 0;
	}

	span {
		color: #262626;
	}
`;

const DescriptionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const DescriptionHeader = styled.div`
	font-style: normal;
	font-weight: 500;
	font-size: 32px;
	line-height: 39px;
	color: #262626;
`;

const DescriptionText = styled.div<{ showMore: boolean }>`
	font-style: normal;
	font-weight: 300;
	font-size: 26px;
	line-height: 31px;
	text-indent: 16px;
	color: #262626;
	height: ${({ showMore }) => (!showMore ? '287px' : '400px')};

	${({ showMore }) => {
		if (!showMore) {
			return `
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 9;
				overflow: hidden;
				text-overflow: ellipsis;
			`;
		} else {
			return `overflow-y: auto;`
		}
	}}
`;

const ShowMoreButton = styled.div`
	cursor: pointer;
	font-style: normal;
	font-weight: 400;
	font-size: 28px;
	line-height: 34px;
	color: #bf8afc;
`;

export default BookPage;
