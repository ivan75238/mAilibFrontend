import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { PropsWithChildren, useState } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';

const MainLayout = observer(({ children }: PropsWithChildren) => {
	const [open, setOpen] = useState(false);

	return (
		<MainWrapper>
			<Header
				open={open}
				setOpen={setOpen}
			/>
			<PageWrapper>
				<Menu
					open={open}
					setOpen={setOpen}
				/>
				<ContentWrapper>{children}</ContentWrapper>
			</PageWrapper>
		</MainWrapper>
	);
});

const MainWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
`;

const PageWrapper = styled.div`
	display: flex;
	width: 100%;
	height: calc(100% - 84px);
`;

const ContentWrapper = styled.div`
	display: flex;
	width: calc(100% - 288px);
	height: 100%;

	@media (max-width: 960px) {
		width: 100%;
	}
`;

export default MainLayout;
