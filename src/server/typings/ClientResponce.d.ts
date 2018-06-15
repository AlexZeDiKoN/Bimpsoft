declare module server {
    interface ClientResponse<T> {
        success: boolean;
        errors: string[];
        payload: T;
    }
}
