import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventData, isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { TabView } from "tns-core-modules/ui/tab-view/tab-view";
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
    idCategory: number;
    idArticle: number;
    tabSelectedIndex: number;
    data: any;

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

            this.tabSelectedIndex = this.getTabIndex();
            console.log("ix", this.tabSelectedIndex);
        });
    }

    getTabIndex() {
        for (const index in this.news.articles[this.idCategory]) {
            if (this.news.articles[this.idCategory][index].codigo === this.idArticle.toString()) {
                return <number><unknown>index;
            }
        }

        return -1;
    }

    onSelectedIndexChanged(event) {
        return false;
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
}
