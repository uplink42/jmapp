import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NewsApiService } from "~/app/services/api.service";

@Component({
    selector: "NewsDetails",
    moduleId: module.id,
    styleUrls: ["./news-details.component.scss"],
    templateUrl: "./news-details.component.html",
})
export class NewsDetailsComponent implements OnInit {

    constructor(public api: NewsApiService) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
    }
}
