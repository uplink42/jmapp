import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AnimationsService {
    private _animationOffset: number;

    get animationOffset(): number {
        return this._animationOffset;
    }

    set animationOffset(offset: number) {
        this._animationOffset = offset;
    }
}
