import {BaseModel} from "./base-model";

export interface ShortCatDefinition {
    name: string;
    id: number;
}



export class Category extends BaseModel {
    public name: string = "";
    public id: number = 0;
    public parent: ShortCatDefinition | null = null;
    public children: Category[] = [];

    public copyChildren(children: any) {
        this.children = children.map((c: any) => (new Category()).copyFrom(c))
    }

    public copyParent(other: any) {
        this.parent = other ? Object.assign({}, other): null;
    }
}
