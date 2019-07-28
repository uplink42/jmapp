import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
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
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BaseComponent implements OnInit, AfterContentInit {
    static eagerLoadedCategories = 2;

    title: string = "JM Madeira";
    categories: Category[];
    articles: { [key: number]: Article[] } = {};
    entryArticles: Article[] = [];
    tabSelectedIndex: number = 0;
    loadedCategories: number[] = [];

    constructor(private api: NewsApiService, private news: NewsService, private cdrchild: ChangeDetectorRef) {
        super(cdrchild);
    }

    ngOnInit(): void {
        console.log(1);
        this.categories = this.news.getCategories();

        const initialCategory = this.categories[0].id;

        this.getCategoryNews(initialCategory);
        this.getEntryNews();
    }

    getCategoryIndex(idCategory: number) {
        const category = this.categories.find(c => c.id === idCategory);

        return category ? this.categories.indexOf(category) : -1;
    }

    getCategoryId(index: number) {
        return this.categories[index - 1].id; // offset by 1 due to entry articles
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const index = args.newIndex;
            if (index <= 0) {
                return;
            }

            this.tabSelectedIndex = index;
            const id = this.getCategoryId(index);
            this.getCategoryNews(id);
        }
    }

    getEntryNews() {
        this.news.getEntryArticles().then(articles => {
            this.entryArticles = articles;
        });
    }

    loadMoreEntryArticles(skip: number) {
        this.news.getEntryArticles(skip).then(entryArticles => {
            this.entryArticles = entryArticles;
        });
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
