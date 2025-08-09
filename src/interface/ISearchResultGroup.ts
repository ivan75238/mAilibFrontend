import { IBook } from './IBook';

export interface ISearchResultGroup {
	label: string;
	code: string;
	items: IBook[];
}
