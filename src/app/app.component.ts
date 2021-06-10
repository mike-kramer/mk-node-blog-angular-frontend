import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CategoryService} from "./shared/services/category.service";
import {MenuItem} from "primeng/api";
import {Category} from "./shared/models/category";
import {AuthService} from "./shared/services/auth.service";
import {isPlatformBrowser} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {environment} from "../environments/environment";
import {filter, map} from "rxjs/operators";

declare let gtag: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'mk-blog-angular-front';

    menu: MenuItem[] = [];
    menuInitialized: boolean = false;

    adminMenu: MenuItem[] = [
        {
            label: "Админка",
            items: [
                {
                    label: "Категории",
                    routerLink: "/admin/categories"
                },
                {
                    label: "Посты",
                    routerLink: "/admin/posts"
                }
            ]
        }
    ]

    constructor(private categoryService: CategoryService, private authService: AuthService, @Inject(PLATFORM_ID) private platform: Object, private router: Router) {
    }

    ngOnInit(): void {
        this.initMenu();
        this.categoryService.categoriesUpdated.subscribe(
            () => this.initMenu()
        );
        this.authService.loggedIn.next(
            () => this.initMenu()
        )
    }

    private initMenu() {
        this.menuInitialized = false;
        this.menu = this.authService.isAuth() ? this.adminMenu : [];
        this.categoryService.getCategories().then(
            (rootCat) => {
                const createItemStruct = (cat: Category, level = 0) => {
                    let item: MenuItem = {
                        label: cat.name,
                    };
                    if (cat.children.length == 0) {
                        item.routerLink = `/categories/${cat.id}`;
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
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(e => <NavigationEnd>e)
        ).subscribe((event: NavigationEnd) => {
                if (environment.gaKey && isPlatformBrowser(this.platform)) {
                    gtag('config', environment.gaKey,
                        {
                            'page_path': event.urlAfterRedirects
                        }
                    );
                }
            }
        );
    }

    toggleAside() {
        if (isPlatformBrowser(this.platform)) {
            document.body.classList.toggle("no-aside");
        }
    }
}
