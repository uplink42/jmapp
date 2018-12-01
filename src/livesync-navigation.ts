import { NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { onAfterLivesync, onBeforeLivesync } from "nativescript-angular/platform-common";
import { RouterExtensions } from "nativescript-angular/router";
let cachedUrl: string;
onBeforeLivesync.subscribe((moduleRef) => {
    console.log("#### onBeforeLivesync");
    if (moduleRef) {
        const router = <Router>moduleRef.injector.get(Router);
        cachedUrl = router.url;
        console.log("-------> Caching URL: " + cachedUrl);
    }
});
onAfterLivesync.subscribe(({ moduleRef, error }) => {
    console.dir(moduleRef);
    console.log(`#### onAfterLivesync moduleRef: ${moduleRef} error: ${error}`);
    if (moduleRef) {
        const router = <RouterExtensions>moduleRef.injector.get(RouterExtensions);
        const ngZone = <NgZone>moduleRef.injector.get(NgZone);
        if (router && cachedUrl) {
          ngZone.run(() => { // <--  should be wrapped in ngZone
            router.navigateByUrl(cachedUrl, { animated: false });
          });
        }
    }
});
