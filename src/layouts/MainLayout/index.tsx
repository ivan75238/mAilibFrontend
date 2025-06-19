import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { PropsWithChildren } from "react";

const MainLayout = observer(({ children }: PropsWithChildren) => {
	return (
    <MainWrapper>
      {children}
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

export default MainLayout;
