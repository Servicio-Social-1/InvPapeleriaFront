import { Article } from "./article.interface";
import { Petitioner } from "./petitioner.interface";

export interface DepartureTicket {
    id: number;
    date: string;
    time: string;
    status: boolean;
    articleExitDetail: ArticleExitDetail[];
    petitioner: Petitioner;
    area: Area;
    user: User;
    options?: ('add' | 'delete' | 'edit' | 'picture_as_pdf')[];
}

export interface Area {
    id: number;
    name: string;
    status: boolean;
    options?: ('edit' | 'delete')[];
}

export interface ArticleExitDetail {
    id: number;
    amount: number;
    article: Article;
    articleExit: ArticleExit;
}

export interface ArticleExit {
    id: number;
    date: string;
    time: string;
    status: boolean;
}

export interface User {
    id: number;
    email: string;
    status: boolean;
    name: string;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
}
