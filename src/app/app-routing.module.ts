import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeedComponent} from "./posts/feed/feed.component";
import {SingleComponent} from "./posts/single/single.component";
import {CategoryComponent} from "./posts/category/category.component";

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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
