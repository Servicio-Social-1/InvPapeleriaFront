export interface UpdateDepartureTicketDto {
    idPetitioner:       number;
    idArea:             number;
    idUser:             number;
    articleExitDetails: ArticleExitDetail[];
}

export interface ArticleExitDetail {
    idArticle: number;
    amount:    number;
}
