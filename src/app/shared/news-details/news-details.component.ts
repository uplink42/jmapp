import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { screen } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { ScrollEventData } from "tns-core-modules/ui/scroll-view";
import { Article } from "~/app/models/article.model";
import { BaseComponent } from "~/app/modules/base.component";
import { AnimationsService } from "~/app/services/animations.service";
import { NewsApiService } from "~/app/services/api.service";

@Component({
    selector: "NewsDetails",
    moduleId: module.id,
    styleUrls: ["./news-details.component.scss"],
    templateUrl: "./news-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailsComponent extends BaseComponent implements OnInit, AfterContentInit {
    static IMAGE_MIN_HEIGHT = 48;
    @Input() article: Article;
    @ViewChild("image", { static: false }) imageRef: ElementRef;
    @ViewChild("title", { static: false }) titleRef: ElementRef;
    @ViewChild("imageContainer", { static: false }) imageContainerRef: ElementRef;

    slug = "noticias";
    hasDescription = false;
    loading = false;
    imageUrl: string;
    imageOpacity = 1;
    offset: number;
    dockedLabelOpacity = 0;
    dockedLabelTextOpacity = 0;

    constructor(public api: NewsApiService, private animationsService: AnimationsService, private cdrchild: ChangeDetectorRef) {
        super(cdrchild);
        this.offset = this.animationsService.animationOffset;
    }

    get minHeight() {
        return screen.mainScreen.heightDIPs + 2 * NewsDetailsComponent.IMAGE_MIN_HEIGHT;
    }

    ngOnInit(): void {
        this.imageUrl = this.api.getImageUrl(this.slug, this.article.image_file_name) || this.api.defaultImage;
        this.removeIntroHtml();
    }

    removeIntroHtml() {
        this.article.introducao = this.article.introducao!.replace("<p>", "").replace("</p>", "");
    }

    animateOut(view: View) {
        view.animate({
            opacity: 0,
            duration: 200,
        });
    }

    getWVStyles() {
        return `<style>
                    * {
                        color: gray;
                        font-size: 14px;
                        margin: 0;
                        padding: 0;
                    }
                </style>`;
    }

    animateIn(view: View, duration: number, delay: number) {
        view.animate({
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            duration,
            delay,
            curve: AnimationCurve.easeOut,
        });
    }

    onScroll(args: ScrollEventData) {
        if (args.scrollY <= 0) {
            return false;
        }

        const imageContainer = this.imageContainerRef.nativeElement;
        const offset = args.scrollY < 0 ? 0 : args.scrollY;
        const imageHeight = imageContainer.getActualSize().height;

        this.applyImageTransition(offset, imageHeight);
        this.applyTitleTransition(offset, imageHeight);
        this.applyDockHeaderTransition(offset, imageHeight);
    }

    loadContent() {
        this.loading = true;
        this.api.getArticle(+this.article.codigo).then(article => {
            this.article = article;
            this.removeIntroHtml();
            this.hasDescription = true;
            this.loading = false;
            this.cdrchild.markForCheck();
        });
    }

    private applyImageTransition(scrollOffset: number, imageHeight: number) {
        const imageContainer = this.imageContainerRef.nativeElement;
        const image = this.imageRef.nativeElement;
        const imageHeightMaxChange = imageHeight - NewsDetailsComponent.IMAGE_MIN_HEIGHT;

        imageContainer.translateY = scrollOffset / 1.5;
        image.scaleX = 1 + scrollOffset / imageHeightMaxChange;
        image.scaleY = 1 + scrollOffset / imageHeightMaxChange;
        this.imageOpacity = 1 - scrollOffset / imageHeightMaxChange;
    }

    private applyTitleTransition(scrollOffset: number, imageHeight: number) {
        const imageHeightMaxChange = imageHeight - NewsDetailsComponent.IMAGE_MIN_HEIGHT;
        const title = this.titleRef.nativeElement;

        if (imageHeightMaxChange < scrollOffset) {
            title.translateX = -(scrollOffset - imageHeightMaxChange) / 1.2;
            title.translateY = -(scrollOffset - imageHeightMaxChange) * 2;
            title.scaleX = 1 - (scrollOffset - imageHeightMaxChange) / imageHeight;
            title.scaleY = 1 - (scrollOffset - imageHeightMaxChange) / imageHeight;
        } else {
            title.translateX = 0;
            title.translateY = 0;
            title.scaleX = 1;
            title.scaleY = 1;
        }
    }

    private applyDockHeaderTransition(scrollOffset: number, imageHeight: number) {
        this.dockedLabelOpacity = this.imageOpacity <= 0 ? 1 : 0;
        this.dockedLabelTextOpacity = (scrollOffset - (imageHeight - NewsDetailsComponent.IMAGE_MIN_HEIGHT)) / NewsDetailsComponent.IMAGE_MIN_HEIGHT - 0.2;
    }
}
