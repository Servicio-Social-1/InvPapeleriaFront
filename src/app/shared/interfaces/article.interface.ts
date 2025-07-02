export interface Article {
    id: number;
    description: string;
    stock: number;
    size: string;
    status: boolean;
    amount?: number;
    options?: ('add' | 'delete' | 'edit')[]
}
