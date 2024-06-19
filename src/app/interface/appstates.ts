import { DataState } from "../enum/datastate.enum";
import { Agency } from "./agency";
import { Category } from "./category";
import { Customer } from "./customer";
import { Events } from "./event";
import { Fournisseur } from "./fournisseur";
import { Product } from "./product";
import { Role } from "./role";
import { Stock } from "./stock";
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
}

export interface CategoryState {
    user: User;
    category: Category;
}

export interface FournisseurState {
    user: User;
    fournisseur: Fournisseur;
}

export interface ProductState {
    user: User;
    product: Product;
}

export interface UserState {
    user: User;
    events?: Events[];
    roles?: Role[];
    access_token?: string;
    refresh_token?: string;
}

export interface AgencyState {
    user: User;
    agency: Agency;
}

export interface StockState {
    user: User;
    stock: Stock;
}

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