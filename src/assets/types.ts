// Define the user interface
export interface User {
    id: number;
    username: string;
    password: string;
    phone_nbr: number;
    role: string;
    create_at: Date;
}

export enum Role {
    Manager = "manager",
    Emploee = "emploee",
}

export interface Photo {
    id: number;
    date: Date;
    location: string;
    visibility: number;
    path: string;
}

export interface PhotoStatus {
    id: number;
    date: Date;
    location: string;
    visibility: number;
    status: number;
    userid: number;
    new_visibility:number;
    username:string;
}