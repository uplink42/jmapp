import { Injectable } from "@angular/core";
import { Article } from "~/app/models/article.model";
import { Category } from "~/app/models/category.model";
import { NewsApiService } from "./api.service";
import { CategoryService } from "./category.service";

@Injectable({
    providedIn: "root",
})
export class NewsService {
    categories: Category[];
    articles: { [key: number]: Article[] } = {};

    constructor(private categoryService: CategoryService, private api: NewsApiService) {
        this.categories = this.categoryService.getCategories();
    }

    getCategories() {
        return this.categories;
    }

    getArticlesByCategory(idCategory, skip = 0): Promise<Article[]> {
        return this.api.getCategoryArticles(idCategory, skip).then(response => {
            const oldCategoryArticles = this.articles[idCategory] || [];
            const categoryArticles = [...oldCategoryArticles, ...response];
            const articles = { ...this.articles, [idCategory]: categoryArticles };
            this.articles = articles;

            return categoryArticles;
        });
    }
}
