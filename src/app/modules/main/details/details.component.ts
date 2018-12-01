import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventData, isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view/tab-view";
import { Article } from "~/app/models/article.model";
import { NewsApiService } from "~/app/services/api.service";
import { NewsService } from "~/app/services/news.service";

// const view = require("ui/core/view");

@Component({
    selector: "Details",
    moduleId: module.id,
    styleUrls: ["./details.component.scss"],
    templateUrl: "./details.component.html",
})
export class DetailsComponent implements OnInit {
    static eagerLoadedArticles = 5;

    idCategory: number;
    idArticle: number;
    tabSelectedIndex: number;
    article: Article;
    loadedArticles: number[] = [];

    constructor(public api: NewsApiService, private activatedRoute: ActivatedRoute,
                private news: NewsService) {

        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.idArticle  = params.id;
            this.idCategory = params.category;
            if (!this.idArticle || ! this.idCategory) {
                console.error("No article/category ID sent");

                return;
            }

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

    getArticleId(index: number) {
        return this.news.articles[this.idCategory][index].codigo;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const index = args.newIndex;
            this.tabSelectedIndex = index;

            this.idArticle = +this.getArticleId(index);
            this.loadAdjacentArticles();
            this.getLocalArticleData();
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
        this.article = this.news.articles[this.idCategory].find(article => article.codigo === this.idArticle.toString());
    }

    loadAdjacentArticles() {
        this.news.articles[this.idCategory].forEach((article, index) => {
            const id = parseInt(article.codigo, 10);
            if (Math.abs(index - this.tabSelectedIndex) <= DetailsComponent.eagerLoadedArticles) {
                this.loadedArticles = [...this.loadedArticles, id];
            }
        });
    }

    isArticleLoaded(idArticle: number) {
        return this.loadedArticles.includes(+idArticle);
    }
}
