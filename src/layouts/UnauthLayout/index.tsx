import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import AuthBackground from '../../svg/AuthBackground';
import { rem } from '../../utils/styledRem';
import AuthBook from '../../svg/AuthBooks';
import { PropsWithChildren } from 'react';

const UnauthLayout = observer(({ children }: PropsWithChildren) => {
	return (
		<MainWrapper>
			<Block width={56}>
				<AuthBackground />
				<ProjectWrapper>
					<ProjectName>mAilib</ProjectName>
					<ProjectDescription>
						Твой лучший сервис, позволяющий вести учет личной библиотеки, смотреть статистику по
						жанрам, датам приобретения, прочитанному и многому другому!
					</ProjectDescription>
				</ProjectWrapper>
				<BooksImage>
					<AuthBook />
				</BooksImage>
			</Block>
			<Block
				width={44}
				justifyContent={'end'}
				alignItems={'center'}>
				{children}
			</Block>
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
`;

const Block = styled.div<{ width: number; justifyContent?: string; alignItems?: string }>`
	display: flex;
	justify-content: ${({ justifyContent }) => justifyContent};
	align-items: ${({ alignItems }) => alignItems};
	width: ${({ width }) => width}%;
	height: 100%;
	position: relative;

	> svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
`;

const ProjectName = styled.div`
	font-style: normal;
	font-weight: 700;
	font-size: ${rem(183)};
	text-align: center;
	color: #ffffff;
`;

const ProjectDescription = styled.div`
	font-style: normal;
	font-weight: 300;
	font-size: ${rem(39)};
	color: #ffffff;
`;

const ProjectWrapper = styled.div`
	width: 100%;
	padding: 125px 142px 0 60px;
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 13px;
	position: relative;
	z-index: 3;
`;

const BooksImage = styled.div`
	position: absolute;
	z-index: 2;
	bottom: 0;
	width: 650px;
	height: 430px;
	overflow: hidden;
`;

export default UnauthLayout;
