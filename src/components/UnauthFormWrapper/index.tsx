import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { rem } from '../../utils/styledRem';
import { routes } from '../../config/routes';
import { useLocation, useNavigate } from 'react-router-dom';

const UnauthFormWrapper = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<FormWrapper>
			<WellcomeText>Добро пожаловать!</WellcomeText>
			{location.pathname.indexOf('up_pas') === 0 && (
				<Tabs>
					<Tab
						width={64}
						isActive={
							location.pathname === routes.main.path ||
							location.pathname === routes.forgottenPassword.path
						}
						onClick={() => navigate(routes.main.link())}>
						Вход
					</Tab>
					<Line />
					<Tab
						width={170}
						isActive={
							location.pathname !== routes.main.path &&
							location.pathname !== routes.forgottenPassword.path
						}
						onClick={() => navigate(routes.registration.link())}>
						Регистрация
					</Tab>
				</Tabs>
			)}
			{children}
		</FormWrapper>
	);
};

const FormWrapper = styled.div`
	width: 700px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-right: 60px;
`;

const WellcomeText = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 400;
	font-size: ${rem(76)};
	line-height: 92px;
	text-align: center;
	color: #262626;
`;

const Tabs = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 28px;
	padding-left: 50px;
`;

const Tab = styled.div<{ isActive: boolean; width: number }>`
	font-style: normal;
	font-weight: ${({ isActive }) => (isActive ? 500 : 300)};
	width: ${({ width }) => width}px;
	font-size: ${rem(28)};
	line-height: 34px;
	color: #262626;
	cursor: pointer;
`;

const Line = styled.div`
	width: 0px;
	height: 59px;
	border-left: 1px solid #262626;
`;

export default UnauthFormWrapper;
