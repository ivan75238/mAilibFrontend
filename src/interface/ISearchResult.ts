import { IBook } from "./IBook";

export interface ISearchResult {
	books: IBook[];
	editions: IBook[];
}
