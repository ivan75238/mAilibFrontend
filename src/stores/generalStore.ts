import { makeAutoObservable } from "mobx";
import { Toast } from "primereact/toast";
import { RefObject } from "react";

class GeneralStore {
	toastRef: RefObject<Toast | null> = { current: null };

	constructor() {
		makeAutoObservable(this);
	}

	showSuccess = (mes: string, title = 'Внимание', time = 3000) => {
		this.toastRef.current?.show({
			severity: 'success',
			summary: title,
			detail: mes,
			life: time,
		});
	};

	showWarn = (mes: string, title = 'Внимание', time = 3000) => {
		this.toastRef.current?.show({
			severity: 'warn',
			summary: title,
			detail: mes,
			life: time,
		});
	};

	showError = (mes: string, title = 'Внимание', time = 3000) => {
		this.toastRef.current?.show({
			severity: 'error',
			summary: title,
			detail: mes,
			life: time,
		});
	};
}

export const generalStore = new GeneralStore();
