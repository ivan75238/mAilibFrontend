import {
  Checkbox as CheckboxPrimereact,
  CheckboxProps,
} from "primereact/checkbox";
import styled from "styled-components";

interface IProps extends CheckboxProps {
  label?: string;
}

const Checkbox = ({ label, ...props }: IProps) => {
  return (
    <Wrapper>
      <CheckboxPrimereact {...props} />
      {label && <label htmlFor="username">{label}</label>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  label {
    font-style: normal;
    font-weight: 400;
    font-size: rem(24);
    line-height: 34px;
    color: #262626;
  }
`;

export default Checkbox;
