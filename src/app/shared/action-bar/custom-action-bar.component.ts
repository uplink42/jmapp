import { Component, Input, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
    selector: "CustomActionBar",
    moduleId: module.id,
    templateUrl: "./custom-action-bar.component.html",
})
export class CustomActionBarComponent {
    @Input() title: string;

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
