import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiBase = environment.apiBase;

    constructor(private http: HttpClient) {
    }

    get(address: string, params: any = {}) {
        const httpParams = this.prepareParams(params);
        return this.http.get(`${this.apiBase}/${address}` + (httpParams ? `?${httpParams.toString()}` : ''));
    }

    post(address: string, params: any) {
        return this.http.post(`${this.apiBase}/${address}`, params);
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
