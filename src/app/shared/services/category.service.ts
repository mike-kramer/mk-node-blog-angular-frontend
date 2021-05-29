import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Category, ShortCatDefinition} from "../models/category";
import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {MenuItem} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoryPromise: Promise<Category> | null = null;
    private categoryById: {[id: number]: Category} = {};

    categoriesUpdated = new Subject();

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

    async categoryPath(category: Category | ShortCatDefinition) {
        let buildPath = (categories: Category[], category: Category | ShortCatDefinition, path: Category[] = []): Category[] | false  => {
            for (let c of categories) {
                let newPath = path.map(p => p);
                newPath.push(c);
                if (c.id == category.id) {
                    return newPath;
                } else if (c.children.length) {
                    let childPath = buildPath(c.children,  category, newPath);
                    if (childPath) {
                        return childPath;
                    }
                }
            }
            return false;
        }
        let categories = (await this.getCategories()).children;
        return buildPath(categories, category);
    }

    async categoryBreadcrumbs(category: Category | ShortCatDefinition, insertLinks: boolean = false): Promise<MenuItem[]> {
        return this.categoryPath(category).then(
            (catPath) => {
                if (!catPath || catPath?.length == 0) {
                    return [];
                }
                let result: MenuItem[] = [];
                catPath.forEach((cat, index) => {
                    if (insertLinks) {
                        result.push({
                            label: cat.name,
                            routerLink: `/categories/${cat.id}`
                        })
                    } else {
                        result.push({label: cat.name});
                    }
                })
                return result;
            }
        ) as Promise<MenuItem[]>
    }

    newCategory(catData: any) {
        return this.api.post("category-admin/create", catData);
    }

    saveCategory(catData: any) {
        return this.api.post("category-admin/update", catData).pipe(
            tap(() => {
                this.categoryPromise = null;
                this.categoriesUpdated.next();
            })
        );
    }

    move(item: any, direction: string) {
        return this.api.post(`category-admin/move/${item}/${direction}`, {}).pipe(
            tap(() => {
                this.categoryPromise = null;
                this.categoriesUpdated.next();
            })
        );
    }

    delete(catId: number) {
        return this.api.delete(`category-admin/${catId}`).pipe(
            tap(() => {
                this.categoryPromise = null;
                this.categoriesUpdated.next();
            })
        );
    }
}
