import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';

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
import {CommentFormComponent} from "./common-components/comment-form/comment-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CaptchaModule} from "primeng/captcha";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import {CardModule} from "primeng/card";
import {LoginComponent} from "./admin/login/login.component";
import {CategoriesManagementComponent} from "./admin/categories-management/categories-management.component";
import {TreeModule} from "primeng/tree";
import {DialogModule} from "primeng/dialog";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {PostsManagementComponent} from "./admin/posts-management/posts-management.component";
import {TableModule} from "primeng/table";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {registerLocaleData} from "@angular/common";
import ru from "@angular/common/locales/ru";
import {PostEditComponent} from "./admin/posts-management/post-edit/post-edit.component";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FileUploaderComponent} from "./common-components/file-uploader/file-uploader.component";
import {ToastModule} from "primeng/toast";

registerLocaleData(ru);

@NgModule({
    declarations: [
        AppComponent,
        PostListComponent,
        FeedComponent,
        SingleComponent,
        CategoryComponent,
        CommentFormComponent,
        LoginComponent,
        CategoriesManagementComponent,
        PostsManagementComponent,
        PostEditComponent,
        FileUploaderComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        CaptchaModule,
        MessagesModule,
        MessageModule,
        CardModule,
        AppRoutingModule,
        PanelMenuModule,
        PanelModule,
        ButtonModule,
        PaginatorModule,
        TreeModule,
        DialogModule,
        ConfirmPopupModule,
        TableModule,
        BreadcrumbModule,
        DropdownModule,
        FileUploadModule,
        ToastModule,
    ],
    providers: [
        {provide: LOCALE_ID, useValue: "ru"},
        Title
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
