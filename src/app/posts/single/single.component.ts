import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PostsService} from "../../shared/services/posts.service";
import {HighlightService} from "../../shared/services/highlight.service";
import {Post} from "../../shared/models/post";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit, AfterViewChecked  {
    post?: Post;

    constructor(private postService: PostsService, private highlightService: HighlightService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(
            async (paramMap) => {
                this.post = await this.postService.single(paramMap.get("id")).toPromise();
                this.titleService.setTitle(this.post.title);
            }
        )
    }

    ngAfterViewChecked() {
        this.highlightService.highlightAll();
    }

    reloadComments() {
        this.postService.single(this.post?.id).toPromise().then(
            (resp) => {
                (this.post as Post).comments = resp.comments;
            }
        )
    }
}
