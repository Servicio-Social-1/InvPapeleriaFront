export interface CreateUserDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
}

export interface AreaDto {
    id?: number;
    name: string;
}

export interface PetitionerDto {
    id?: number;
    name: string;
}

