export interface WithPagination<Item> {
	page: number;
	pageSize: number;
	items: Item[];
	total: number;
}
