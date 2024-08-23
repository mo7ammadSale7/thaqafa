import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from 'app/data/services/Generic.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private gs: GenericService) { }

    createUser(data: any): Observable<any> {
        return this.gs.post('user', data);
    }

    getAllUsers(options: {}): Observable<any> {
        return this.gs.get('user', options);
    }

    getUserById(id: string, options: {}): Observable<any> {
        return this.gs.get(`user/${id}`, options);
    }

    updateUser(id: string, data: any) {
        return this.gs.put(`user/${id}`, data);
    }

    updateUserPassword(data: any) {
        return this.gs.patch(`user/update-password`, data);
    }

    deleteUser(id: string): Observable<any> {
        return this.gs.delete(`user/${id}`);
    }
}
