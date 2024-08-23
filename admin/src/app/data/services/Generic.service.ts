import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GenericService {
    apiURL = environment.base_URL;

    constructor(private http: HttpClient) { }

    post(url: string, postData: any): Observable<any> {
        return this.http.post(`${this.apiURL}${url}`, postData);
    }

    get(url: string, options: any): Observable<any> {
        return this.http.get(`${this.apiURL}${url}`, options);
    }

    put(url: string, putData: any): Observable<any> {
        return this.http.put(`${this.apiURL}${url}`, putData);
    }

    patch(url: string, patchData: any): Observable<any> {
        return this.http.patch(`${this.apiURL}${url}`, patchData);
    }

    delete(url: string): Observable<any> {
        return this.http.delete(`${this.apiURL}${url}`);
    }
}
