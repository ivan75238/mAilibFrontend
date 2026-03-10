export interface IRecentRead {
	book_id: string;
	fantlab_id: string | null;
	type: string;
	name: string;
	image_small?: string | null;
	read_date: string;
}

export interface IFamilyRecentReads {
	member_id: string;
	first_name: string;
	last_name: string;
	recent_reads: IRecentRead[];
}
