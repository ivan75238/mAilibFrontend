import { InputText, InputTextProps } from "primereact/inputtext";
import styled from "styled-components";

interface IProps extends InputTextProps {
  label?: string;
  errorText?: string;
}

const Input = ({ label, errorText, ...props }: IProps) => {
  return (
    <Wrapper>
      {label && <label htmlFor="username">{label}</label>}
      <InputText {...props} />
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

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

export default Input;
