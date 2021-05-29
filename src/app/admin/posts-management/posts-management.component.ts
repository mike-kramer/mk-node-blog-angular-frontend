import {Component, OnInit} from '@angular/core';
import {PostsService} from "../../shared/services/posts.service";
import {Post} from "../../shared/models/post";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {CategoryService} from "../../shared/services/category.service";
import {ShortCatDefinition} from "../../shared/models/category";

@Component({
    selector: 'app-posts-management',
    templateUrl: './posts-management.component.html',
    styleUrls: ['./posts-management.component.scss']
})
export class PostsManagementComponent implements OnInit {
    posts: Post[] = [];
    page: number = 1;
    total: number = 0;
    readonly perPage = 20;
    catBreadCrubms: {[i: number]: MenuItem[]} = {};

    constructor(
        private postsService: PostsService,
        private categoryService: CategoryService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe(
            async (paramMap) => {
                this.page = paramMap.get("page") ? parseInt(paramMap.get("page") as string): 1;
                let {posts, postsCount} = await this.postsService.adminList(this.page, this.perPage).toPromise();
                this.posts = posts;
                this.total = postsCount;
                for (let p of this.posts) {
                    if (!p.category) {
                        continue;
                    }
                    this.catBreadCrubms[p.category?.id as number] = await this.categoryService.categoryBreadcrumbs(p.category as ShortCatDefinition)
                }
            }
        )
    }

    navigateToNewPost() {
        this.router.navigate(["/admin/posts/new"]);
    }
}
