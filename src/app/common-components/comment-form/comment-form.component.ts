import {Component, OnInit, EventEmitter, Input, ViewChild, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {PostsService} from "../../shared/services/posts.service";
import {Captcha} from "primeng/captcha";

@Component({
    selector: 'app-comment-form',
    templateUrl: './comment-form.component.html',
    styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
    @Input() postId?: number | null;
    @ViewChild("captchaComponent") captcha?: Captcha;

    commentForm = this.fb.group({
        authorName: ["", [Validators.required]],
        authorEmail: ["", [Validators.required, Validators.email]],
        commentText: ["", [Validators.required]],
        recaptchaAnswer: ["", [Validators.required]]
    });

    readonly recaptchaKey: string = environment.recaptchaKey;

    @Output() commentPosted = new EventEmitter<any>();

    constructor(private fb: FormBuilder, private postsService: PostsService) {
    }

    ngOnInit(): void {
    }

    saveResponse($event: any) {
        this.commentForm.patchValue({recaptchaAnswer: $event.response})
    }

    resetCaptchaAnswer() {
        this.commentForm.patchValue({recaptchaAnswer: null})
    }

    sendComment() {
        if (this.commentForm.invalid) {
            Object.keys(this.commentForm.controls).forEach(key => {
                this.commentForm.get(key)?.markAsDirty();
            })
            return this.commentForm.markAllAsTouched();
        }

        this.postsService.addComment((this.postId as number), this.commentForm.value).toPromise().then(
            () => {
                this.commentPosted.emit();
                this.commentForm.reset();
                this.captcha!.reset();
            }
        )
    }
}
