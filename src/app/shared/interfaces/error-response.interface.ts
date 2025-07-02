export interface ErrorResponse {
    headers: {
        normalizedNames: any,
        lazyUpadte: any
    },
    status: string
    statusText: string
    url: string
    ok: boolean;
    name: string
    message: string
    error: {
        statusCode: number;
        message: string;
        error: string;
    }
}