import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeedComponent} from "./posts/feed/feed.component";
import {SingleComponent} from "./posts/single/single.component";
import {CategoryComponent} from "./posts/category/category.component";
import {LoginComponent} from "./admin/login/login.component";
import {CategoriesManagementComponent} from "./admin/categories-management/categories-management.component";
import {PostsManagementComponent} from "./admin/posts-management/posts-management.component";
import {PostEditComponent} from "./admin/posts-management/post-edit/post-edit.component";
import {AdminGuardGuard} from "./shared/services/guards/admin-guard.guard";

const routes: Routes = [
    {
        path: "",
        component: FeedComponent
    },
    {
        path: "post/:id",
        component: SingleComponent
    },
    {
        path: "categories/:id",
        component: CategoryComponent
    },
    {
        path: "admin/login",
        component: LoginComponent
    },
    {
        path: "admin",
        redirectTo: "admin/categories",
    },
    {
        path: "admin/categories",
        component: CategoriesManagementComponent,
        canActivate: [AdminGuardGuard],
    },
    {
        path: "admin/posts",
        component: PostsManagementComponent
    },
    {
        path: "admin/posts/:id",
        component: PostEditComponent,
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
