import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { TNSFrescoModule } from "nativescript-fresco/angular";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import * as fresco from "nativescript-fresco";
import * as application from "tns-core-modules/application";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

if (application.android) {
    application.on("launch", () => {
        fresco.initialize();
    });
}

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptHttpClientModule,
        TNSFrescoModule,
    ],
    declarations: [
        AppComponent,
        // NewsListComponent,
    ],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
})
export class AppModule { }
