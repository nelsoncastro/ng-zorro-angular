export interface DefaultFilter {
    page: number;
    pageSize: number;
    sortField: string | null;
    sortOrder: string | null;
    filters: Array<{ key: string; value: string }>;
}
