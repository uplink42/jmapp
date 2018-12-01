import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { DetailsComponent } from "./details/details.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "details/:category/:id", component: DetailsComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule { }
