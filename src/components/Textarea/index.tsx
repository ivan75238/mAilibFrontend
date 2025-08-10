import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import styled from 'styled-components';

interface IProps extends InputTextareaProps {
	label?: string;
	errorText?: string;
	width?: string;
}

const Textarea = ({ label, errorText, width, ...props }: IProps) => {
	return (
		<Wrapper width={width}>
			{label && <label htmlFor='username'>{label}</label>}
			<InputTextarea {...props} />
			{errorText && <ErrorText>{errorText}</ErrorText>}
		</Wrapper>
	);
};

const Wrapper = styled.div<{ width?: string }>`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: ${({ width }) => width || '100%'};
	min-width: ${({ width }) => width || '100%'};

	label {
		font-style: normal;
		font-weight: 500;
		font-size: 28px;
		line-height: 34px;
		color: #262626;
	}
`;

const ErrorText = styled.div`
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: #e24c4c;
`;

export default Textarea;
