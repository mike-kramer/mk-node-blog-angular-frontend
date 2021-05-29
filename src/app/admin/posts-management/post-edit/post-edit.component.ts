import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Category} from "../../../shared/models/category";
import {CategoryService} from "../../../shared/services/category.service";
import {PostsService} from "../../../shared/services/posts.service";
import {tap} from "rxjs/operators";

interface CatDropdownDef{
    name: string;
    id: number
}

@Component({
    selector: 'app-post-edit',
    templateUrl: './post-edit.component.html',
    styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
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
    constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private postsService: PostsService) {
    }

    async ngOnInit() {
        this.categories = await this.categoryService.getCategories();
        this.buildCategoriesForDropdown();
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
            () => {
                this.inProcess = false;
            }
        )
    }
}
