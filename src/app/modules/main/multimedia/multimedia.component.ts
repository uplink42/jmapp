import {  AfterContentInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Multimedia } from "~/app/models/multimedia.model";
import { NewsService } from "~/app/services/news.service";
import { BaseComponent } from "../../base.component";

@Component({
    selector: "Multimedia",
    moduleId: module.id,
    templateUrl: "./multimedia.component.html",
})
export class MultimediaComponent extends BaseComponent implements OnInit, AfterContentInit {
    title = "Multimédia";

    multimedia: Multimedia[] = [];

    constructor(private news: NewsService, private cdrchild: ChangeDetectorRef) {
        super(cdrchild);
    }

    ngOnInit() {
        this.getMultimediaContent();
    }

    getMultimediaContent() {
        this.news.getMultimediaArticles().then(articles => {
            this.multimedia = articles;
        });
    }

    loadMoreMultimedia(skip: number) {
        this.news.getMultimediaArticles(skip).then(articles => {
            this.multimedia = [...this.multimedia, ...articles];
        });
    }
}
