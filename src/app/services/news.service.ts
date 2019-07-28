import { Injectable } from "@angular/core";
import { Article } from "~/app/models/article.model";
import { Category } from "~/app/models/category.model";
import { Multimedia } from "./../models/multimedia.model";
import { NewsApiService } from "./api.service";
import { CategoryService } from "./category.service";

@Injectable({
    providedIn: "root",
})
export class NewsService {
    categories: Category[];
    articles: { [key: number]: Article[] } = {};
    entryArticles: Article[] = [];

    articleOffsets: { [key: number]: number } = {};
    entryArticleOffset: number;

    multimedias: Multimedia[] = [];

    constructor(private categoryService: CategoryService, private api: NewsApiService) {
        this.categories = this.categoryService.getCategories();
    }

    getCategories() {
        return this.categories;
    }

    getArticlesByCategory(idCategory, skip = 0): Promise<Article[]> {
        return this.api.getCategoryArticles(idCategory, skip).then(response => {
            const oldCategoryArticles = this.articles[idCategory] || [];
            const categoryArticles    = [...oldCategoryArticles, ...response];
            const articles            = { ...this.articles, [idCategory]: categoryArticles };
            this.articleOffsets       = { ... this.articleOffsets, [idCategory]: Math.max(this.articleOffsets[idCategory] || 0, skip) };

            this.articles = articles;

            return categoryArticles;
        });
    }

    getEntryArticles(skip = 0) {
        return this.api.getHeadlines(skip).then(response => {
            const articles     = [...this.entryArticles, ...response];

            this.entryArticles      = articles;
            this.entryArticleOffset = Math.max(this.entryArticleOffset || 0, skip);

            return articles;
        });
    }

    getMultimediaArticles(skip = 0) {
        return this.api.getMultimedia(skip).then(response => {
            const multimedias = [...this.multimedias, ...response];
            // this.entryArticleOffset = Math.max(this.entryArticleOffset || 0, skip);

            return multimedias;
        });
    }

    isLastArticle(idArticle: number, idCategory: number) {
        if (idCategory) {
            const index = this.articles[idCategory].findIndex(article => parseInt(article.codigo, 10) === idArticle);
            if (index >= (this.articles[idCategory].length - 3)) {

                return true;
            }

            return false;
        }
    }
}
