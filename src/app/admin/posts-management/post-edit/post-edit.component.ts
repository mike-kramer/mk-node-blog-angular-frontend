import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Category} from "../../../shared/models/category";
import {CategoryService} from "../../../shared/services/category.service";
import {PostsService} from "../../../shared/services/posts.service";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {of, ReplaySubject} from "rxjs";
import {MessageService} from "primeng/api";

interface CatDropdownDef{
    name: string;
    id: number
}

@Component({
    selector: 'app-post-edit',
    templateUrl: './post-edit.component.html',
    styleUrls: ['./post-edit.component.scss'],
    providers: [MessageService]
})
export class PostEditComponent implements OnInit, OnDestroy {
    private destroy$ = new ReplaySubject();
    postForm = this.formBuilder.group({
        id: [],
        title: ["", [Validators.required]],
        text: ["", [Validators.required]],
        excerpt: [""],
        categoryId: [null, [Validators.required]]
    });
    categories?: Category;
    categoriesFormDropdown: CatDropdownDef[] = [];
    inProcess: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private categoryService: CategoryService,
        private postsService: PostsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async ngOnInit() {
        this.categories = await this.categoryService.getCategories();
        this.buildCategoriesForDropdown();
        this.activatedRoute.paramMap.pipe(
            takeUntil(this.destroy$),
            switchMap((params) => params.get("id") ? this.postsService.adminSingle(parseInt(params.get("id") as string)): of(null)),
            takeUntil(this.destroy$),
        ).subscribe(
            (resp) => {
                if (resp) {
                    this.postForm.patchValue(Object.assign({categoryId: resp.category?.id}, resp));
                }
            }
        )
    }

    private buildCategoriesForDropdown() {
        this.categoriesFormDropdown = [];
        const scan = (categories: Category[], prevStr: string = "") => {
            for (let c of categories) {
                const categoryFullName = prevStr + (prevStr !== "" ? " > ": "") + c.name;
                this.categoriesFormDropdown.push({
                    id: c.id,
                    name: categoryFullName
                });
                if (c.children.length) {
                    scan(c.children, categoryFullName);
                }
            }
        }
        scan(this.categories?.children as Category[]);
    }

    saveForm() {
        if (this.inProcess) {
            return;
        }
        if (this.postForm.invalid) {
            Object.keys(this.postForm.controls).forEach((key) => this.postForm.get('key')?.markAsDirty());
            return;
        }
        this.postsService.savePost(this.postForm.value).pipe(
            tap(() => this.inProcess = true)
        ).subscribe(
            (resp: any) => {
                this.inProcess = false;
                if (!this.postForm.value.id) {
                    this.router.navigate(["/admin/posts", resp.id]).then(
                        () => this.messageService.add({severity: "success", summary: "Пост создан", detail: "Пост успешно создан"})
                    )
                } else {
                    this.messageService.add({severity: "success", summary: "Пост сохранён", detail: "Пост сохранён"})
                }
            }
        )
    }
}
