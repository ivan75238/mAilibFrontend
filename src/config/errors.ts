import { MIN_PASS_LENGTH } from "./config";

export const errorsDescriptions = {
	required: 'Поле обязательно для заполнения',
	email: 'Не корректный формат email',
	minPassLength: `Количество символов в пароле должно быть не менее ${MIN_PASS_LENGTH}`,
	passValidate: `Пароль должен содержать минимум 8 символов, 1 заглавная, 1 цифра, 1 спецсимвол`,
	passNotEquals: `Пароли не совпадают`,
};
