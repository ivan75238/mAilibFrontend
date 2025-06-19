import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { errorsDescriptions } from '../../config/errors';
import styled from 'styled-components';
import { routes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';
import UnauthFormWrapper from '../../components/UnauthFormWrapper';
import Button from '../../components/Button';
import { useMutation } from '@tanstack/react-query';
import { apiRequester } from '../../utils/apiRequester';
import { RESEND_CODE, VERIFY } from '../../config/urls';
import { observer } from 'mobx-react-lite';
import { InputOtp } from 'primereact/inputotp';
import { generalStore } from '../../stores/generalStore';

interface IFormData {
	code: string;
}

const schema = yup.object().shape({
	code: yup.string().required(errorsDescriptions.required),
});

const VerifyPage = observer(() => {
	const navigate = useNavigate();
	const [timeLeft, setTimeLeft] = useState(10);
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prevTime) => prevTime - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			clearInterval(interval!);
			setIsActive(false);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, timeLeft]);

	const mutationResend = useMutation({
		mutationFn: () => {
			const email = localStorage.getItem('email');
			return apiRequester.post(RESEND_CODE, { email });
		},
		onSuccess: (_response) => {
			generalStore.showSuccess('Код повторно отправлен');
			setTimeLeft(120);
			setIsActive(true);
		},
	});

	const resendCode = () => {
		mutationResend.mutate();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	const { control, handleSubmit } = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(schema),
		defaultValues: {
			code: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) => {
			const email = localStorage.getItem('email');
			return apiRequester.post(VERIFY, { ...formData, email });
		},
		onSuccess: (_response) => {
			localStorage.removeItem('email');
			generalStore.showSuccess('Аккаунт подтвержден, можете авторизоваться', 'Успех!');
			navigate(routes.main.link());
		},
	});

	/**
	 * Обработчик нажатия на кнопку "Завершить регистрацию"
	 */
	const onSave = useCallback((formData: IFormData) => {
		mutation.mutate(formData);
	}, []);

	return (
		<UnauthFormWrapper>
			<Wrapper>
				<Text>Пожалуйста, введите код, отправленный на указанную почту. </Text>
				<Controller
					render={({ field, fieldState }) => {
						return (
							<InputWrapper>
								<InputOtp
									{...field}
									{...fieldState}
									onChange={(e) => field.onChange(e.value)}
									integerOnly
									length={6}
								/>
							</InputWrapper>
						);
					}}
					name='code'
					control={control}
				/>
				<Button
					label={'Завершить регистрацию'}
					onClick={handleSubmit(onSave)}
					height={68}
				/>
				<Button
					label={'Отправить код повторно'}
					onClick={resendCode}
					height={68}
					outlined
					disabled={isActive}
				/>
				{isActive && <TimerText>Запросить повторный код через {formatTime(timeLeft)}</TimerText>}
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

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-top: 4px;
	margin-bottom: 84px;

	input {
		height: 92px;
		width: 80px;
		font-size: 44px;
	}
`;

const Text = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 200;
	font-size: 32px;
	text-align: center;
	color: #262626;
	margin-top: 40px;
`;

const TimerText = styled.div`
	width: 100%;
	font-style: normal;
	font-weight: 200;
	font-size: 20px;
	text-align: center;
	color: #262626;
	margin-top: -15px;
`;

export default VerifyPage;
