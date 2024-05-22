import { DataState } from "../enum/datastate.enum";
import { Customer } from "./customer";
import { Events } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?: boolean;
    phone?: string;
}

export interface CustomHttpResponse<T> {
    timestamp: Date;
    statusCode: number;
    status: string;
    message: string;
    reason?: string;
    developerMessage?: string;
    data?: T;
}

export interface Profile {
    user: User;
    events?: Events[];
    roles?: Role[];
    access_token?: string;
    refresh_token?: string;
}

export interface Stats {
    user: User;
    stats: Stats;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    size: number;
    number: number;
}

export interface CustomerState {
    user: User;
    customer: Customer;
    stats: Stats;
}

// export interface StatsState {
//     user: User;
//     stats: Stats;
// }

export interface RegisterState {
    dataState: DataState;
    registerSuccess?: boolean;
    error?: string;
    message?: string;
}

export type AccountType = 'account' | 'password';

export interface VerifySate {
    dataState: DataState;
    verifySuccess?: boolean;
    error?: string;
    message?: string;
    title?: string;
    type?: AccountType;
}