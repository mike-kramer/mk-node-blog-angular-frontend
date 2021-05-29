import {Component, OnInit} from '@angular/core';
import {Category} from "../../shared/models/category";
import {CategoryService} from "../../shared/services/category.service";
import {ConfirmationService, TreeNode} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {$e} from "@angular/compiler/src/chars";

@Component({
    selector: 'app-categories-management',
    templateUrl: './categories-management.component.html',
    styleUrls: ['./categories-management.component.scss'],
    providers: [ConfirmationService]
})
export class CategoriesManagementComponent implements OnInit {
    private categories?: Category;
    treeNodes: TreeNode[] = [];

    newCategoryForm = this.formBuilder.group({
        id: [],
        parentId: [],
        name: ["", [Validators.required]]
    });
    showCategoryDia: boolean = false;

    expandedIds: number[] = [];

    constructor(private categoriesService: CategoryService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
    }

    async ngOnInit() {
        this.categories = await this.categoriesService.getCategories();
        this.scanTree();
    }

    private scanTree() {
        const makeTreeNodes = (cat: Category) => {
            const node: TreeNode = {
                label: cat.name,
                data: cat.id,
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                expanded: this.expandedIds.includes(cat.id)
            };
            if (cat.children.length) {
                node.children = [];
                for (let c of cat.children) {
                    node.children.push(makeTreeNodes(c));
                }
            }
            return node;
        }

        this.treeNodes = [makeTreeNodes(this.categories as Category)];
    }

    addSub(parent: TreeNode) {
        this.newCategoryForm.reset({parentId: parent.data});
        this.showCategoryDia = true;
    }

    saveCategory() {
        if (!this.newCategoryForm.valid) {
            Object.keys(this.newCategoryForm.controls).forEach(c => this.newCategoryForm.get(c)?.markAsDirty());
            return;
        }
        const catData = this.newCategoryForm.value;
        let promise: Promise<any>;
        if (!catData.id) {
            promise = this.categoriesService.newCategory(catData).toPromise();
        } else {
            promise = this.categoriesService.saveCategory(catData).toPromise();
        }

        promise.then(
            () => this.categoriesService.getCategories()
        ).then(
            (resp) => {
                this.categories = resp;
                this.scanTree();
                this.showCategoryDia = false;
            }
        );
    }

    nodeCollapsed($event: any) {
        this.expandedIds = this.expandedIds.filter(e => e != $event.node.data);
    }

    nodeExpanded($event: any) {
        this.expandedIds.push($event.node.data)
    }

    move(node: any, direction: 'up' | 'down') {
        this.categoriesService.move(node.data, direction).toPromise().then(
            () => this.categoriesService.getCategories()
        ).then(
            (resp) => {
                this.categories = resp;
                this.scanTree();
            }
        )
    }

    edit(node: any) {
        const setEditedCategory = (c: Category) => {
            if (c.id == node.data) {
                this.newCategoryForm.patchValue({
                    parentId: c.parent?.id,
                    name: c.name,
                    id: c.id
                });
                this.showCategoryDia = true;
                return true;
            } else {
                for (let child of c.children) {
                    if (setEditedCategory(child)) {
                        return true;
                    }
                }
            }
            return false;
        }
        setEditedCategory(this.categories as Category);
    }

    delete($event: MouseEvent, node: any) {
        this.confirmationService.confirm({
            target: $event.target as EventTarget,
            message: "Вы правда хотите удалить эту категорию?",
            acceptLabel: "Да",
            rejectLabel: "Нет",
            accept: () => {
                this.categoriesService.delete(node.data).toPromise().then(
                    () => this.categoriesService.getCategories()
                ).then(
                    (resp) => {
                        this.categories = resp;
                        this.scanTree();
                    }
                )
            }
        })
    }
}
