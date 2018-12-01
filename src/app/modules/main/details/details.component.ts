import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventData, isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view/tab-view";
import { Article } from "~/app/models/article.model";
import { BaseComponent } from "~/app/modules/base.component";
import { NewsApiService } from "~/app/services/api.service";
import { CategoryService } from "~/app/services/category.service";
import { NewsService } from "~/app/services/news.service";

@Component({
    selector: "Details",
    moduleId: module.id,
    styleUrls: ["./details.component.scss"],
    templateUrl: "./details.component.html",
})
export class DetailsComponent extends BaseComponent implements OnInit {
    static eagerLoadedArticles = 5;

    title: string | null;
    idCategory: number;
    idArticle: number;
    tabSelectedIndex: number;
    article: Article;
    loadedArticles: number[] = [];

    constructor(public api: NewsApiService, private activatedRoute: ActivatedRoute,
                private news: NewsService, private categoryService: CategoryService) {
                    super();
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.idArticle  = params.id;
            this.idCategory = params.category;
            if (!this.idArticle || ! this.idCategory) {
                console.error("No article/category ID sent");

                return;
            }

            this.title = this.getCategoryName();
            this.tabSelectedIndex = this.getTabIndex(this.idArticle);
            if (this.tabSelectedIndex >= 0) {
                this.getLocalArticleData();
                this.loadAdjacentArticles();
            } else {
                // get remote
            }
        });
    }

    getTabIndex(idArticle) {
        for (const index in this.news.articles[this.idCategory]) {
            if (this.news.articles[this.idCategory][index].codigo === idArticle.toString()) {
                return <number><unknown>index;
            }
        }

        return -1;
    }

    getCategoryName() {
        const category = this.categoryService.getCategories().find(c => c.id === +this.idCategory);

        return category ? category.name : null;
    }

    getArticleId(index: number) {
        const article = this.news.articles[this.idCategory][index];

        return article ? article.codigo : null;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const index = args.newIndex;
            this.tabSelectedIndex = index;
            const id = this.getArticleId(index);

            if (id) {
                this.idArticle = +id;
                this.loadAdjacentArticles();
                this.getLocalArticleData();
            }
        }
    }

    onTabViewLoaded(event: EventData) {
        const tabView = <TabView>event.object;
        if (isIOS) {
            tabView.viewController.tabBar.hidden = true;
        }

        if (isAndroid) {
            const tabLayout = tabView.nativeViewProtected.tabLayout;
            tabLayout.getLayoutParams().height = 0;
            tabLayout.requestLayout();
        }
    }

    getLocalArticleData() {
        const result = this.news.articles[this.idCategory].find(article => article.codigo === this.idArticle.toString());
        if (result) {
            this.article = result;
        }
    }

    loadAdjacentArticles() {
        this.news.articles[this.idCategory].forEach((article, index) => {
            if (article.codigo) {
                const id = parseInt(article.codigo, 10);
                if (Math.abs(index - this.tabSelectedIndex) <= DetailsComponent.eagerLoadedArticles) {
                    this.loadedArticles = [...this.loadedArticles, id];
                }
            }
        });
    }

    isArticleLoaded(idArticle: number) {
        return this.loadedArticles.includes(+idArticle);
    }
}
