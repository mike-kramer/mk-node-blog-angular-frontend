import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {AuthKeyStorageService} from "./auth-key-storage.service";
import {tap} from "rxjs/operators";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn = new Subject();
    loggedOut = new Subject();

    constructor(private api: ApiService, private authKeyStorage: AuthKeyStorageService) {
    }

    public isAuth() {
        return !!this.authKeyStorage.readAuthKey();
    }

    login(credentials: any) {
        return this.api.post("auth/login", credentials).pipe(
            tap((resp: any) => {
                this.authKeyStorage.writeAuthKey(resp.access_token);
                this.loggedIn.next();
            })
        );
    }

    logout() {
        this.authKeyStorage.deleteAuthKey();
        this.loggedOut.next();
    }

}
