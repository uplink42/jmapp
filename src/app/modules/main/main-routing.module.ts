import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MultimediaDetailsComponent } from "./multimedia-details/multimedia-details.component";

import { DetailsComponent } from "./details/details.component";
import { HomeComponent } from "./home/home.component";
import { MultimediaComponent } from "./multimedia/multimedia.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "multimedia", component: MultimediaComponent },
    { path: "multimediadetails/:id", component: MultimediaDetailsComponent },
    { path: "details/:category/:id", component: DetailsComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule { }
