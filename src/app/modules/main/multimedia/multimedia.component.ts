import {  AfterContentInit, Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base.component";

@Component({
    selector: "Multimedia",
    moduleId: module.id,
    templateUrl: "./multimedia.component.html",
})
export class MultimediaComponent extends BaseComponent implements OnInit, AfterContentInit {
    // tslint:disable-next-line:no-empty
    ngOnInit() {
        // @ts-ignore;
    }
}
