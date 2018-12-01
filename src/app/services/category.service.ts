import { Injectable } from "@angular/core";
import { Category } from "~/app/models/category.model";

@Injectable({
    providedIn: "root",
})
export class CategoryService {

    getCategories(): Category[] {
        return [
            { id: 1, name: "Região" },
            { id: 2, name: "Nacional" },
            { id: 4, name: "Internacional" },
            { id: 5, name: "Economia" },
            { id: 6, name: "Palcos" },
            { id: 7, name: "Desporto" },
            { id: 8, name: "Religião" },
            { id: 9, name: "Aconteceu" },
            { id: 10, name: "Comunidades" },
        ];
    }
}
