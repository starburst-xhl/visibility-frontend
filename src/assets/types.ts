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

// // Export a user object
// export const user: User = {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@example.com",
// };