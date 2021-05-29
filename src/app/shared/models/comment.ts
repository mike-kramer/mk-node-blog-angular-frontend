import {BaseModel} from "./base-model";

export class Comment extends BaseModel {
    id?: number;
    authorName: string = "";
    createdAt: string = "";
    commentText?: string;
}
