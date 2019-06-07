import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";

@Component({
    selector: "Base",
    moduleId: module.id,
    templateUrl: "./base.component.html",
})
export class BaseComponent implements OnInit, AfterContentInit {
    viewLoaded = false;

    constructor(private cdr: ChangeDetectorRef) {}

    // tslint:disable-next-line:no-empty
    ngOnInit() {}

    ngAfterContentInit() {
        setTimeout(() => {
            this.viewLoaded = true;
            this.cdr.detectChanges();
        });
    }
}
