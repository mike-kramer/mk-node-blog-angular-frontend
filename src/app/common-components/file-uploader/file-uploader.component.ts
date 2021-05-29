import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {AuthKeyStorageService} from "../../shared/services/auth-key-storage.service";
import {HttpHeaders} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {fromPromise} from "rxjs/internal-compatibility";
import {delay, tap} from "rxjs/operators";

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
    fileUploadUrl = `${environment.apiBase}/file-upload`;
    headers: HttpHeaders = new HttpHeaders({
        Authorization: `Bearer ${this.tokenStorage.readAuthKey()}`
    });

    uploadedPath = new FormControl();
    justCopied: boolean = false;
    constructor(public tokenStorage: AuthKeyStorageService) {
    }

    ngOnInit(): void {
    }

    showUploadedUrl($event: any) {
        this.uploadedPath.setValue($event.originalEvent.body.uploadedFilePath.replace(/\\/g, "/"));
    }

    copyUrl() {
        fromPromise(navigator.clipboard.writeText(this.uploadedPath.value)).pipe(
            tap(() => this.justCopied = true),
            delay(2000)
        ).subscribe(
            () => this.justCopied = false
        );
    }
}
