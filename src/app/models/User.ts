import { Country } from "./Country";

export interface User {
    id?: number,
    username?: string,
    firstName?: string,
    lastName?: string,
    password?: string
    OIB?: number,
    country?: any
}