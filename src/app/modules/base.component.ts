import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
    selector: "Base",
    moduleId: module.id,
    templateUrl: "./base.component.html",
})
export class BaseComponent implements OnInit, AfterViewInit {
    viewLoaded = false;

    // tslint:disable-next-line:no-empty
    ngOnInit() {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.viewLoaded = true;
        });
    }
}
