import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
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
                public news: NewsService, private categoryService: CategoryService, private cdrchild: ChangeDetectorRef) {
                    super(cdrchild);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.idArticle  = params.id;
            this.idCategory = parseInt(params.category, 10);
            if (!this.idArticle) {
                console.error("No article sent");

                return;
            }

            this.title            = this.getCategoryName();
            this.tabSelectedIndex = this.idCategory ? this.getTabIndex(this.idArticle) : this.getEntryTabIndex(this.idArticle);
            if (this.tabSelectedIndex >= 0) {
                this.getLocalArticleData();
                this.loadAdjacentArticles();
            } else {
                // if we are near the end, fetch next page
            }
        });
    }

    loadNextRemotePage() {
        // if (this.idCategory) {
            return this.news.getArticlesByCategory(this.idCategory, this.news.articleOffsets[this.idArticle]);
        // }
    }

    getTabIndex(idArticle: number) {
        for (const index in this.news.articles[this.idCategory]) {
            if (this.news.articles[this.idCategory][index].codigo === idArticle.toString()) {
                return <number><unknown>index;
            }
        }

        return -1;
    }

    getEntryTabIndex(idArticle: number) {
        for (const index in this.news.entryArticles) {
            if (this.news.entryArticles[index].codigo === idArticle.toString()) {
                return <number><unknown>index;
            }
        }

        return -1;
    }

    getCategoryName() {
        if (!this.idCategory) {

            return "Todos";
        }

        const category = this.categoryService.getCategories().find(c => c.id === +this.idCategory);

        return category ? category.name : null;
    }

    getArticleId(index: number) {
        if (this.idCategory) {
            const article = this.news.articles[this.idCategory][index];

            return article ? article.codigo : null;
        }

        const entryArticle = this.news.entryArticles[index];

        return entryArticle ? entryArticle.codigo : null;
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

            // if we are near the end (last page), fetch next page
            /*if (this.news.isLastArticle(this.idArticle, this.idCategory)) {
                this.loadNextRemotePage().then(() => this.onSelectedIndexChanged(args));
            }*/
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
        if (this.idCategory) {
            const result = this.news.articles[this.idCategory].find(article => article.codigo === this.idArticle.toString());
            if (result) {
                this.article = result;
            }
        } else {
            const result = this.news.entryArticles.find(article => article.codigo === this.idArticle.toString());
            if (result) {
                this.article = result;
            }
        }
    }

    loadAdjacentArticles() {
        if (this.idCategory) {
            this.news.articles[this.idCategory].forEach((article, index) => {
                if (article.codigo) {
                    const id = parseInt(article.codigo, 10);
                    if (Math.abs(index - this.tabSelectedIndex) <= DetailsComponent.eagerLoadedArticles) {
                        this.loadedArticles = [...this.loadedArticles, id];
                    }
                }
            });
        } else {
            this.news.entryArticles.forEach((article, index) => {
                if (article.codigo) {
                    const id = parseInt(article.codigo, 10);
                    if (Math.abs(index - this.tabSelectedIndex) <= DetailsComponent.eagerLoadedArticles) {

                        this.loadedArticles = [...this.loadedArticles, id];
                    }
                }
            });
        }
    }

    isArticleLoaded(idArticle: number) {
        return this.loadedArticles.includes(+idArticle);
    }
}
