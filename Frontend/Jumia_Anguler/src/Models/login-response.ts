export interface LoginResponse {
    token: string;
    expiration: string;
    userId: string;
    roles: string[];
}
