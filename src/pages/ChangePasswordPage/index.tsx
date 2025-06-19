import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { errorsDescriptions } from '../../config/errors';
import styled from 'styled-components';
import Input from '../../components/Input';
import { routes } from '../../config/routes';
import { useNavigate, useParams } from 'react-router-dom';
import UnauthFormWrapper from '../../components/UnauthFormWrapper';
import Button from '../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { CHANGE_PASSWORD } from '../../config/urls';
import { observer } from 'mobx-react-lite';
import { generalStore } from '../../stores/generalStore';
import { MIN_PASS_LENGTH } from '../../config/config';

interface IFormData {
	password: string;
	passwordRepeat: string;
}

const schema = yup.object().shape({
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
});

const ChangePasswordPage = observer(() => {
	const navigate = useNavigate();
	const { token } = useParams();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(schema),
		defaultValues: {
			password: '',
			passwordRepeat: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			return apiRequester.post(CHANGE_PASSWORD, { ...formData, token });
		},
		onSuccess: (_response) => {
			navigate(routes.main.link());
			generalStore.showSuccess('Ваш пароль успешно изменён. Вы можете продолжить авторизациию.');
		},
	});

	/**
	 * Обработчик нажатия на кнопку "Продолжить"
	 */
	const onSave = useCallback(
		(formData: IFormData) => {
			mutation.mutate(formData);
		},
		[token]
	);

	return (
		<UnauthFormWrapper>
			<Wrapper>
				<Text>Введите, пожалйста, новый пароль.</Text>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								label={'Новый пароль'}
								placeholder={'Ваш новый пароль'}
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
								placeholder={'Повторите новый пароль'}
								type={'password'}
								invalid={!!errors?.passwordRepeat?.message}
								errorText={errors?.passwordRepeat?.message}
							/>
						);
					}}
					name='passwordRepeat'
					control={control}
				/>
				<Button
					label={'Сменить пароль'}
					onClick={handleSubmit(onSave)}
					height={68}
					style={{ marginTop: '60px' }}
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

const Text = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 200;
	font-size: 26px;
	text-align: center;
	color: #262626;
	margin-top: 16px;
`;

export default ChangePasswordPage;
