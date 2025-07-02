export interface DepartureTicketToTable {
    id: number
    date: string
    time: string
    petitioner: string
    area: string;
    user: string;
    options?: ('add' | 'delete' | 'edit' | 'picture_as_pdf')[]
}
