import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from "~/app/shared/shared.module";
import { DetailsComponent } from "./details/details.component";
import { HomeComponent } from "./home/home.component";
import { MainRoutingModule } from "./main-routing.module";

// tslint:disable-next-line
if (module['hot']) {
    // tslint:disable-next-line
    module['hot'].accept();
}

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MainRoutingModule,
        SharedModule,
    ],
    declarations: [
        HomeComponent,
        DetailsComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
})
export class MainModule { }
