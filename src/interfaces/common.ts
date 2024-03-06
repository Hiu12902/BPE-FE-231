export interface IPagination {
    page?: number;
    limit: number;
    total: number;
}

export interface IQueryParams {
    page?: number;
    size?: number | string;
    [key: string]: any;
}

export interface UseMutation {

    onSuccess?: (data: any) => void;
    onError?: (err: ErrorResponse | unknown) => void;
    onSettled?: () => void;
}

export interface ErrorResponse {
    error: string;
    message: string;
    path: string;
    requestId: string;
    status: number;
    timestamp: string;
}