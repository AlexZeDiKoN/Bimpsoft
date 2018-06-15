declare module server {
    interface ServerResponse {
        success: boolean;
        isAllowed: boolean;
        messages: string[];
        errors: string[];
        payload: string;
    }
}
