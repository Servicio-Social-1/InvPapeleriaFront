export interface DepartureTicketDetail {
    amount: number;
    article: Article;
    articleExit: ArticleExit;
    id: number;
}

export interface Article {
    id: number;
    description: string;
    stock: number;
    size: string;
    status: boolean;
}

export interface ArticleExit {
    id: number;
    date: string;
    time: string;
    status: boolean;
    petitioner: Area;
    area: Area;
    user: User;
}

export interface Area {
    id: number;
    name: string;
    status: boolean;
}

export interface User {
    id: number;
    email: string;
    status: boolean;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
}
