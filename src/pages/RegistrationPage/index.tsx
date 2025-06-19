import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { errorsDescriptions } from '../../config/errors';
import { MIN_PASS_LENGTH } from '../../config/config';
import styled from 'styled-components';
import Input from '../../components/Input';
import { routes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';
import UnauthFormWrapper from '../../components/UnauthFormWrapper';
import Button from '../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { REGISTRATION } from '../../config/urls';
import { observer } from 'mobx-react-lite';

interface IFormData {
	email: string;
	password: string;
	passwordRepeat: string;
	firstName: string;
	lastName: string;
	middleName?: string;
}

const schema = yup.object().shape({
	email: yup
		.string()
		.required(errorsDescriptions.required)
		.matches(
			/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
			errorsDescriptions.email
		),
	password: yup
		.string()
		.required(errorsDescriptions.required)
		.min(MIN_PASS_LENGTH, errorsDescriptions.minPassLength)
		.matches(
			/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
			errorsDescriptions.passValidate
		),
	passwordRepeat: yup
		.string()
		.required(errorsDescriptions.required)
		.min(MIN_PASS_LENGTH, errorsDescriptions.minPassLength)
		.matches(
			/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
			errorsDescriptions.passValidate
		)
		.test(
			'pass-equal',
			errorsDescriptions.passNotEquals,
			(passRep, context) => passRep === context.parent.password
		),
	firstName: yup.string().required(errorsDescriptions.required),
	lastName: yup.string().required(errorsDescriptions.required),
	middleName: yup.string(),
});

const RegistrationPage = observer(() => {
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(schema),
		defaultValues: {
			email: '',
			password: '',
			passwordRepeat: '',
			firstName: '',
			lastName: '',
			middleName: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			return apiRequester.post(REGISTRATION, formData);
		},
		onSuccess: (_response, formData) => {
			localStorage.setItem('email', formData.email);
			navigate(routes.verify.link());
		},
	});

	/**
	 * Обработчик нажатия на кнопку "Зарегистрироваться"
	 */
	const onSave = useCallback((formData: IFormData) => {
		mutation.mutate(formData);
	}, []);

	return (
		<UnauthFormWrapper>
			<Wrapper>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								label={'Email'}
								placeholder={'Ваша почта'}
								invalid={!!errors?.email?.message}
								errorText={errors?.email?.message}
							/>
						);
					}}
					name='email'
					control={control}
				/>
				<Row>
					<Controller
						render={({ field, fieldState }) => {
							return (
								<Input
									{...field}
									{...fieldState}
									label={'Пароль'}
									placeholder={'Ваш пароль'}
									type={'password'}
									invalid={!!errors?.password?.message}
									errorText={errors?.password?.message}
								/>
							);
						}}
						name='password'
						control={control}
					/>
					<Controller
						render={({ field, fieldState }) => {
							return (
								<Input
									{...field}
									{...fieldState}
									label={'Подтверждение пароля'}
									placeholder={'Повторите пароль'}
									type={'password'}
									invalid={!!errors?.passwordRepeat?.message}
									errorText={errors?.passwordRepeat?.message}
								/>
							);
						}}
						name='passwordRepeat'
						control={control}
					/>
				</Row>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								label={'Имя'}
								placeholder={'Ваше имя'}
								invalid={!!errors?.firstName?.message}
								errorText={errors?.firstName?.message}
							/>
						);
					}}
					name='firstName'
					control={control}
				/>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								label={'Фамилия'}
								placeholder={'Ваша фамилия'}
								invalid={!!errors?.lastName?.message}
								errorText={errors?.lastName?.message}
							/>
						);
					}}
					name='lastName'
					control={control}
				/>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								label={'Отчество'}
								placeholder={'Ваше отчество'}
								invalid={!!errors?.middleName?.message}
								errorText={errors?.middleName?.message}
							/>
						);
					}}
					name='middleName'
					control={control}
				/>
				<Button
					label={'Зарегистрироваться'}
					onClick={handleSubmit(onSave)}
					height={68}
				/>
			</Wrapper>
		</UnauthFormWrapper>
	);
});

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	gap: 24px;
`;

const Row = styled.div`
	display: flex;
	width: 100%;
	gap: 24px;
`;

export default RegistrationPage;
