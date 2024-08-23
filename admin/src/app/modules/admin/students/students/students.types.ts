export interface IStudent {
    _id: string;
    name?: string;
    nationalID?: string;
    gender?: string;
    address?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    isReceived?: boolean;
    subscriptions?: ISubscription[];
    note?: string;
    status?: Boolean;
    createdBy?: string;
    createdAt?: any;
    updatedBy?: string;
    updatedAt?: any;
}

export interface ISubscription {
    _id: string;
    year?: string;
    level?: string;
    score?: string;
}
