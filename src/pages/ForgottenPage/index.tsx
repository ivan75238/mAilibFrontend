import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { errorsDescriptions } from '../../config/errors';
import styled from 'styled-components';
import Input from '../../components/Input';
import { routes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';
import UnauthFormWrapper from '../../components/UnauthFormWrapper';
import Button from '../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { SEND_CHANGE_PASSWORD } from '../../config/urls';
import { observer } from 'mobx-react-lite';
import { generalStore } from '../../stores/generalStore';

interface IFormData {
	email: string;
}

const schema = yup.object().shape({
	email: yup
		.string()
		.required(errorsDescriptions.required)
		.matches(
			/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
			errorsDescriptions.email
		),
});

const ForgottenPage = observer(() => {
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
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			return apiRequester.post(SEND_CHANGE_PASSWORD, formData);
		},
		onSuccess: (_response) => {
			navigate(routes.main.link());
			generalStore.showSuccess('Ссылка для восстановления доступа успешно отправлена на почту.');
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
				<Text>
					Укажите, пожалуйста, Вашу почту, на которую будет отправлена ссылка для восстановления
					доступа.
				</Text>
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
				<Button
					label={'Продолжить'}
					onClick={handleSubmit(onSave)}
					height={68}
					style={{ marginTop: '100px' }}
				/>
				<Button
					label={'Вернуться назад'}
					onClick={() => navigate(routes.main.link())}
					height={68}
					outlined
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

export default ForgottenPage;
