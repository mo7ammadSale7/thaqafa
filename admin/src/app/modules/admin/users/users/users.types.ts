export interface IUser {
    _id: string;
    name?: string;
    email: string;
    photo?: string;
    role?: string;
    password?: string;
    passwordConfirm?: number;
    status?: string;
    createdAt?: any;
}
