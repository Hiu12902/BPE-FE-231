export interface IPagination {
    page?: number;
    limit: number;
    total: number;
}

export interface IQueryParams {
    [key: string]: any;
}

export interface IFilters {
    [key: string]: any;
}