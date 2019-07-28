import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventData } from "tns-core-modules/ui/core/bindable/bindable";
import { isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view/tab-view";
import { Multimedia } from "~/app/models/multimedia.model";
import { BaseComponent } from "~/app/modules/base.component";
import { NewsApiService } from "~/app/services/api.service";
import { CategoryService } from "~/app/services/category.service";
import { NewsService } from "~/app/services/news.service";

@Component({
    selector: "MultimediaDetails",
    moduleId: module.id,
    styleUrls: ["./multimedia-details.component.scss"],
    templateUrl: "./multimedia-details.component.html",
})
export class MultimediaDetailsComponent extends BaseComponent implements OnInit {
    static eagerLoadedArticles = 5;

    imageUrl: string;

    idMultimedia: number;

    multimedia: Multimedia;

    tabSelectedIndex: number;

    loadedMultimedias: number[] = [];

    constructor(public api: NewsApiService, private activatedRoute: ActivatedRoute,
                public news: NewsService, private categoryService: CategoryService, private cdrchild: ChangeDetectorRef) {
                    super(cdrchild);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.idMultimedia = params.id;
            if (!this.idMultimedia) {
                console.error("No multimedia sent");

                return;
            }

            this.tabSelectedIndex = this.getTabIndex(this.idMultimedia);
            if (this.tabSelectedIndex >= 0) {
                this.getLocalData();
                // this.loadAdjacentMultimedias();
            }
        });
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

    getMultimediaId(index: number) {
        const multimedias = this.news.multimedias[index];

        return multimedias ? multimedias.codigo : null;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const index = args.newIndex;
            this.tabSelectedIndex = index;
            const id = this.getMultimediaId(index);

            if (id) {
                this.idMultimedia = +id;
                this.loadAdjacentMultimedias();
                this.getLocalData();
            }
        }
    }

    getTabIndex(idMultimedia: number) {
        for (const index in this.news.multimedias) {
            if (this.news.multimedias[index].codigo === idMultimedia.toString()) {
                return <number><unknown>index;
            }
        }

        return -1;
    }

    getLocalData() {
        console.log(this.news.multimedias.length);
        this.news.multimedias.forEach((multimedia, index) => {
            if (multimedia.codigo) {
                const id = parseInt(multimedia.codigo, 10);
                if (Math.abs(index - this.tabSelectedIndex) <= MultimediaDetailsComponent.eagerLoadedArticles) {

                    this.loadedMultimedias = [...this.loadedMultimedias, id];
                }
            }
        });
    }

    loadAdjacentMultimedias() {
        this.news.multimedias.forEach((multimedia, index) => {
            if (multimedia.codigo) {
                const id = parseInt(multimedia.codigo, 10);
                if (Math.abs(index - this.tabSelectedIndex) <= MultimediaDetailsComponent.eagerLoadedArticles) {

                    this.loadedMultimedias = [...this.loadedMultimedias, id];
                }
            }
        });
    }

    launchMedia() {
       // if (this.multimedia.)
    }
}
