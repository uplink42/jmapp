import { AfterViewInit, Component, OnInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Article } from "~/app/models/article.model";
import { Category } from "~/app/models/category.model";
import { BaseComponent } from "~/app/modules/base.component";
import { NewsApiService } from "~/app/services/api.service";
import { NewsService } from "~/app/services/news.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})
export class HomeComponent extends BaseComponent implements OnInit, AfterViewInit {
    static eagerLoadedCategories = 2;

    title: string = "JM Madeira";
    categories: Category[];
    articles: { [key: number]: Article[] } = {};
    tabSelectedIndex: number = 0;
    loadedCategories: number[] = [];
    viewLoaded = false;

    constructor(private api: NewsApiService, private news: NewsService) {
        super();
    }

    ngOnInit(): void {
        this.categories = this.news.getCategories();
        const initialCategory = this.categories[0].id;

        this.loadAdjacentCategories(initialCategory);
        this.getCategoryNews(initialCategory);
    }

    getCategoryIndex(idCategory: number) {
        const category = this.categories.find(c => c.id === idCategory);

        return category ? this.categories.indexOf(category) : -1;
    }

    getCategoryId(index: number) {
        return this.categories[index].id;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const index = args.newIndex;
            this.tabSelectedIndex = index;
            const id = this.getCategoryId(index);

            this.loadAdjacentCategories(id);
            this.getCategoryNews(id);
        }
    }

    loadAdjacentCategories(idCategory: number) {
        for (let i = 0; i <= HomeComponent.eagerLoadedCategories; i += 1) {
            const next = idCategory + i;
            if (!this.isCategoryLoaded(next) && this.getCategoryIndex(next) >= 0) {
                this.loadedCategories.push(next);
            }
        }
    }

    isCategoryLoaded(idCategory: number) {
        return this.loadedCategories.includes(idCategory);
    }

    getCategoryNews(idCategory: number) {
        for (let i = 0; i <= HomeComponent.eagerLoadedCategories; i += 1) {
            const next = idCategory + i;
            if (!this.articles[next] && this.getCategoryIndex(next) >= 0) {
                this.news.getArticlesByCategory(next).then(categoryArticles => {
                    this.articles = { ...this.articles, [next]: categoryArticles };
                });
            }
        }
    }

    loadMoreArticles(skip) {
        const idCategory = this.getCategoryId(this.tabSelectedIndex);
        this.news.getArticlesByCategory(idCategory, skip).then(categoryArticles => {
            this.articles = { ...this.articles, [idCategory]: categoryArticles };
        });
    }
}
