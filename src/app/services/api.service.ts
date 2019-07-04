import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiConfig } from "~/app/config/api";

@Injectable({
    providedIn: "root",
})
export class NewsApiService {
    defaultImage: "https://www.jm-madeira.pt/file/index/default";

    constructor(private http: HttpClient) {}

    getHeadlines(skip: number = 0) {
        return this.sendRequest("get_artigos_entrada", skip, null);
    }

    getMultimedia(skip = 0) {
        return this.sendRequest("get_multimedias", 25, skip);
    }

    getRegionArticles(skip: number = 0) {
        return this.sendRequest("get_noticias_categoria", 1, skip);
    }

    getCategoryArticles(id: number, skip: number = 0) {
        return this.sendRequest("get_noticias_categoria", id, skip);
    }

    getArticle(id: number) {
        return this.sendRequest("get_artigo", id);
    }

    getImageUrl(section?: string, path?: string) {
        return `${apiConfig.baseImg}${section}/${path}`;
    }

    private sendRequest(endpoint: string, id: number | null = null, skip: number | null = null): Promise<any> {
        console.log(`${apiConfig.baseUrl}/${endpoint}/${id}/${skip}`);
        if (id) {
            return this.http.get(`${apiConfig.baseUrl}/${endpoint}/${id}/${skip}`).toPromise();
        } else {
            return this.http.get(`${apiConfig.baseUrl}/${endpoint}/${skip}`).toPromise();
        }
    }
}
