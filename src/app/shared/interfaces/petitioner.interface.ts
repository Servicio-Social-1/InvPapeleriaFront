import { Area } from './departure-ticket.interface';
export interface Petitioner {
    id: number;
    name: string;
    status: boolean;
    area: Area;
    options?: ('edit' | 'delete')[];
}
