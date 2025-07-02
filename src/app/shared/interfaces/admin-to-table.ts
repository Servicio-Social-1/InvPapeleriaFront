export interface UserToTable {
    id: number;
    email: string;
    status: boolean;
    role: string;
    name: string;
    options?: ('edit' | 'delete')[];
}

export interface PetitionerToTable {
    id: number;
    name: string;
    status: boolean;
    area?: string;
    options?: ('edit' | 'delete')[];
}
