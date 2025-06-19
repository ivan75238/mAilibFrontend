import { Button as ButtonPrimereact, ButtonProps } from 'primereact/button';
import styled from 'styled-components';

interface IProps extends ButtonProps {
	height?: number;
	outlined?: boolean;
}

const Button = ({ height, outlined, ...props }: IProps) => {
	return (
		<ButtonPrimereactStyled
			height={height}
			outlined={!!outlined}
			{...props}
		/>
	);
};

const ButtonPrimereactStyled = styled(ButtonPrimereact)<{ height?: number; outlined: boolean }>`
	width: 100%;
	height: ${({ height }) => (height ? `${height}px` : undefined)};
	background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
	border: 0px;

	${({ outlined }) =>
		outlined &&
		`
    background: transparent;

    span {
      background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  
    ::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      
      background: linear-gradient(90.76deg, #b373ff 0%, #f85593 59.61%, #ffd24c 106.79%);
      padding: 2px; /* Толщина границы */
      border-radius: 8px; /* Должно совпадать с border-radius кнопки */
      
      /* Смещаем позади контента */
      z-index: -1;
      
      /* Обрезаем лишнее, чтобы осталась только рамка */
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `}
`;

export default Button;
