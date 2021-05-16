import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../shared/services/category.service";
import {PostsService} from "../../shared/services/posts.service";
import {Category} from "../../shared/models/category";
import {Post} from "../../shared/models/post";
import {ActivatedRoute, Router} from "@angular/router";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {Location} from "@angular/common";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    category?: Category;
    posts: Post[] = [];
    total: number = 0;
    currentPage = 1;
    constructor(
        private categoryService: CategoryService,
        private postsService: PostsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _location: Location
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(
            async (paramMap) => {
                this.currentPage = paramMap.get("page") ? parseInt(paramMap.get("page") as string): 1;
                this.category = await this.categoryService.getCategory(parseInt(paramMap.get("id") as string));
                let {posts, total} = await this.postsService.getPosts({page: this.currentPage, category: this.category.id}).toPromise();
                this.posts = posts;
                this.total = total;
            }
        )
    }

    changePage($event: any) {
        this.router.navigate([this._location.path().split("?")[0]], {
            queryParams: {page: $event.page + 1}
        }).then(() => {
            window.scrollTo(0, 0);
        });
    }

}
