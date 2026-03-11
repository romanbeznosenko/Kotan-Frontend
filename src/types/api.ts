export interface ApiResponse<T> {
    data: T;
    message: string;
    httpStatus: string;
}
