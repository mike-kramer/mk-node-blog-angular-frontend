import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Category} from "../models/category";
import {map, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoryPromise: Promise<Category> | null = null;
    private categoryById: {[id: number]: Category} = {};

    constructor(private api: ApiService) {
    }

    getCategories(update = false): Promise<Category> {
        if (!this.categoryPromise || update) {
            this.categoryPromise = this.api.get("posts/categories").pipe(
                map((resp: any) => (new Category()).copyFrom(resp[0])),
                tap((resp: Category) => {
                    let scan = (categories: Category[]) => {
                        for (let c of categories) {
                            this.categoryById[c.id] = c;
                            if (c.children.length) {
                                scan(c.children);
                            }
                        }
                    }
                    scan(resp.children);
                })
            ).toPromise();
        }
        return this.categoryPromise;
    }

    async getCategory(id: number) {
        await this.getCategories();
        return this.categoryById[id];
    }
}
