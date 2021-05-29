import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthKeyStorageService} from "./auth-key-storage.service";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiBase = environment.apiBase;

    constructor(private http: HttpClient, private authKeyStorage: AuthKeyStorageService) {
    }

    get requestOptions() {
        let headers: any = {};
        let authKey = this.authKeyStorage.readAuthKey();
        if (authKey) {
            headers.Authorization = `Bearer ${authKey}`;
        }
        return {headers: new HttpHeaders(headers)};
    }

    get(address: string, params: any = {}) {
        const httpParams = this.prepareParams(params);
        return this.http.get(`${this.apiBase}/${address}` + (httpParams && httpParams?.keys().length > 0 ? `?${httpParams.toString()}` : ''), this.requestOptions);
    }

    delete(address: string) {
        return this.http.delete(`${this.apiBase}/${address}`, this.requestOptions);
    }

    post(address: string, params: any) {
        return this.http.post(`${this.apiBase}/${address}`, params, this.requestOptions);
    }

    private prepareParams(params: any) {
        let httpParams: HttpParams | null = null;
        if (params) {
            httpParams = new HttpParams();
            for (let i in params) {
                if (params[i] !== null) {
                    httpParams = httpParams.append(i, params[i]);
                }
            }
        }
        return httpParams;
    }
}
