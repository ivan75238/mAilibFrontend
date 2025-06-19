import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { errorsDescriptions } from '../../config/errors';
import { MIN_PASS_LENGTH } from '../../config/config';
import styled from 'styled-components';
import Input from '../../components/Input';
import Checkbox from '../../components/Checkbox';
import { rem } from '../../utils/styledRem';
import { routes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';
import UnauthFormWrapper from '../../components/UnauthFormWrapper';
import Button from '../../components/Button';
import { Button as ButtonPrimereact } from 'primereact/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { LOGIN } from '../../config/urls';

interface IFormData {
	email: string;
	password: string;
	rememberMe?: boolean;
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
	rememberMe: yup.boolean(),
});

const LoginPage = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

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
			rememberMe: undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			return apiRequester.post<{
				accessToken: string;
				refreshToken: string;
			}>(LOGIN, {
				password: formData.password,
				email: formData.email,
			});
		},
		onSuccess: (response, formData) => {
			if (formData.rememberMe) {
				localStorage.setItem('accessToken', response.data.accessToken);
				localStorage.setItem('refreshToken', response.data.refreshToken);
			} else {
				sessionStorage.setItem('accessToken', response.data.accessToken);
				sessionStorage.setItem('refreshToken', response.data.refreshToken);
			}
			queryClient.refetchQueries({ queryKey: ['userData'] });
			navigate(routes.myBooks.link());
		},
	});

	/**
	 * Обработчик нажатия на кнопку "Продолжить"
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
				<RememberWrapper>
					<Controller
						render={({ field, fieldState }) => {
							return (
								<Checkbox
									{...field}
									{...fieldState}
									label='Запомнить меня'
									checked={!!field.value}
								/>
							);
						}}
						name='rememberMe'
						control={control}
					/>
					<ButtonPrimereact
						label='Забыли пароль?'
						link
						onClick={() => navigate(routes.forgottenPassword.link())}
					/>
				</RememberWrapper>
				<Button
					label={'Войти'}
					onClick={handleSubmit(onSave)}
					height={68}
				/>
			</Wrapper>
		</UnauthFormWrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	gap: 24px;
`;

const RememberWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 40px;

	button {
		width: 200px;
		padding: 0;

		span {
			font-style: normal;
			font-weight: 400;
			font-size: ${rem(16)};
			line-height: 29px;
			color: #262626;
			text-decoration: underline;
		}
	}
`;

export default LoginPage;
