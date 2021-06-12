import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthKeyStorageService} from "../auth-key-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

    constructor(private storageService: AuthKeyStorageService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.storageService.readAuthKey()) {
            this.router.navigate(["/admin/login"]);
            return false;
        }
        return true;
    }

}
