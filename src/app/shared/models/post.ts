import {BaseModel} from "./base-model";
import {Category, ShortCatDefinition} from "./category";

export class Post extends BaseModel {
    category: ShortCatDefinition | null = null;
    createdAt: string = "";
    excerpt: string = "";
    id: number | null = null;
    text: string = "";
    title: string = "";
    updatedAtTimeStamp: number| null = null;

    get excerptOrText() {
        return this.excerpt && this.excerpt.length ? this.excerpt: Post.truncateText(this.text, 200);
    }

    copyCategory(cat: any) {
        this.category = Object.assign({}, cat);
    }

    copyUpdatedAtTimeStamp(t: any) {
        this.updatedAtTimeStamp = t * 1;
    }

    private static truncateText(postText: string, length: number): string {
        let morePosition = postText.indexOf("<!--more-->");
        if (morePosition !== -1) {
            postText = postText.substr(0, morePosition);
            return postText.replace(/(<([^>]+)>)/ig,"");
        }
        let result = postText.replace(/(<([^>]+)>)/ig,"").substr(0, length);
        if (result.length < postText.length) {
            result += "…";
        }
        return result;
    }
}
