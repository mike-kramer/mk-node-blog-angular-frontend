import {Component, OnInit} from '@angular/core';
import {CategoryService} from "./shared/services/category.service";
import {MenuItem} from "primeng/api";
import {Category} from "./shared/models/category";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'mk-blog-angular-front';

    menu: MenuItem[] = [];
    menuInitialized: boolean = false;

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
        this.categoryService.getCategories().then(
            (rootCat) => {
               const createItemStruct = (cat: Category, level = 0) => {
                   let item: MenuItem = {
                       label: cat.name,
                   };
                   if (cat.children.length == 0) {
                    item.routerLink =  `/categories/${cat.id}`;
                   } else {
                       item.items = [{
                           label: "Всё",
                           routerLink: `/categories/${cat.id}`
                       }];
                       for (let c of cat.children) {
                           (item.items as MenuItem[]).push(createItemStruct(c));
                       }
                   }
                   return item;
               }
               for (let c of rootCat.children) {
                   this.menu.push(createItemStruct(c));
               }
               this.menuInitialized = true;
            }
        );
    }

    toggleAside() {
        document.body.classList.toggle("no-aside");
    }
}
