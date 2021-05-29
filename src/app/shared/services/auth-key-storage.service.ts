import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthKeyStorageService {
    readonly storage: Storage = localStorage;
    readonly keyField = "mkblog-auth-key";

    constructor() {
    }

    public writeAuthKey(value: string) {
        this.storage.setItem(this.keyField, value);
    }

    public readAuthKey() {
        return this.storage.getItem(this.keyField);
    }

    public deleteAuthKey() {
        this.storage.removeItem(this.keyField);
    }
}
