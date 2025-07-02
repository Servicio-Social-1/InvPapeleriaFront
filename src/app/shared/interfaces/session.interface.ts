export interface Session {
    id:    number;
    email: string;
    role:  Role;
    token: string;
}

export interface Role {
    id:   number;
    name: string;
}
