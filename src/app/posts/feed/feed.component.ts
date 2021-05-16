import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../../shared/models/post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostsService} from "../../shared/services/posts.service";
import {Subscription} from "rxjs";
import {Location} from "@angular/common";

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
    posts: Post[] = [];
    total: number = 0;
    currentPage: number = 1;

    constructor(private activatedRoute: ActivatedRoute, public _location: Location, private postsService: PostsService, private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(
            async (paramMap) => {
                this.currentPage = paramMap.get("page") ? parseInt(paramMap.get("page") as string): 1;
                let {posts, total} = await this.postsService.getPosts({page: this.currentPage}).toPromise();
                this.posts = posts;
                this.total = total;
            }
        );
    }

    changePage($event: any) {
        this.router.navigate([this._location.path().split("?")[0]], {
            queryParams: {page: $event.page + 1}
        }).then(() => {
            window.scrollTo(0, 0);
        });
    }
}
