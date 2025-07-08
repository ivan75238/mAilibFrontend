import { IUser } from "./IUser";

export interface IFamily {
	id: string;
	leader_id: string;
	users: IUser[];
}