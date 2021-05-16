import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {PanelMenuModule} from "primeng/panelmenu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PostListComponent} from "./common-components/post-list/post-list.component";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {FeedComponent} from "./posts/feed/feed.component";
import {SingleComponent} from "./posts/single/single.component";
import {PaginatorModule} from "primeng/paginator";
import {CategoryComponent} from "./posts/category/category.component";

@NgModule({
    declarations: [
        AppComponent,
        PostListComponent,
        FeedComponent,
        SingleComponent,
        CategoryComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        PanelMenuModule,
        PanelModule,
        ButtonModule,
        PaginatorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
