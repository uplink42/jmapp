import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NewsListComponent } from "~/app/shared/news-list/news-list.component";
import { NewsDetailsComponent } from "./news-details/news-details.component";

// tslint:disable-next-line
if (module['hot']) {
    // tslint:disable-next-line
    module['hot'].accept();
}

@NgModule({
    imports: [
        NativeScriptCommonModule,
    ],
    declarations: [
        NewsListComponent,
        NewsDetailsComponent,
    ],
    exports: [
        NewsListComponent,
        NewsDetailsComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
})
export class SharedModule { }
