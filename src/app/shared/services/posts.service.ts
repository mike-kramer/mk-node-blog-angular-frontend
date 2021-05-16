import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

interface PostAnswer {
    posts: Post[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    constructor(private api: ApiService) {
    }

    getPosts(query: { page?: number, category?: number }): Observable<PostAnswer> {
        return this.api.get("posts", query).pipe(
            map((resp: any) => ({
                posts: resp[0].map((p: any) => new Post().copyFrom(p)),
                total: resp[1]
            }))
        );
    }

    single(id: any): Observable<Post> {
        return this.api.get(`posts/${id}`).pipe(
            map((resp: any) => new Post().copyFrom(resp))
        )
    }
}
