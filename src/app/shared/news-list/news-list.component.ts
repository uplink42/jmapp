import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Article } from "~/app/models/article.model";
import { NewsApiService } from "~/app/services/api.service";
import { itemsPerPage } from "./../../config/api";

@Component({
    selector: "NewsList",
    moduleId: module.id,
    styleUrls: ["./news-list.component.scss"],
    templateUrl: "./news-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListComponent implements OnInit {
    @Input() items;
    @Input() itemsPerPage = itemsPerPage;
    @Input() slug = "noticias";
    @Input() category: number;
    @Output() load = new EventEmitter();

    skip: number;

    constructor(public api: NewsApiService, private router: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.skip = 0;
    }

    loadMoreItems() {
        this.skip += this.itemsPerPage;
        this.load.emit(this.skip);
    }

    navigateTo(event, article: Article) {
        this.router.navigate([`/main/details/${this.category}/${article.codigo}`]);
    }
}
