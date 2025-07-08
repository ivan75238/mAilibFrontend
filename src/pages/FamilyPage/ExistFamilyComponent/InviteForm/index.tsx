import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { apiRequester } from '../../../../utils/apiRequester';
import { FAMILY_INVITE_SEND } from '../../../../config/urls';
import { useCallback } from 'react';
import Input from '../../../../components/Input';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { errorsDescriptions } from '../../../../config/errors';
import Button from '../../../../components/Button';
import { generalStore } from '../../../../stores/generalStore';

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

const InviteForm = () => {
	const {
		control,
		handleSubmit,
		reset,
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
			return apiRequester.post(FAMILY_INVITE_SEND, formData);
		},
		onSuccess: (_response) => {
			generalStore.showSuccess('Приглашение отправлено');
			reset();
		},
	});

	/**
	 * Обработчик нажатия на кнопку "отправить приглашенеие"
	 */
	const onSave = useCallback((formData: IFormData) => {
		mutation.mutate(formData);
	}, []);

	return (
		<InviteUserWrapper>
			<TitleText>Укажите Email пользователя, которого хотите добавить в семью.</TitleText>
			<FieldWrapper>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<Input
								{...field}
								{...fieldState}
								placeholder={'Почта пользователя'}
								invalid={!!errors?.email?.message}
								errorText={errors?.email?.message}
								width={'436px'}
							/>
						);
					}}
					name='email'
					control={control}
				/>
				<Button
					label={'Отправить приглашенеие'}
					onClick={handleSubmit(onSave)}
					height={46}
					width={320}
				/>
			</FieldWrapper>
		</InviteUserWrapper>
	);
};

const TitleText = styled.div`
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	color: #262626;
`;

const InviteUserWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FieldWrapper = styled.div`
	display: flex;
	gap: 40px;
`;

export default InviteForm;
