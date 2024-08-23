import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private gs: GenericService) { }

    createCategory(data: any): Observable<any> {
        return this.gs.post('category', data);
    }

    getAllCategories(options: {}): Observable<any> {
        return this.gs.get('category', options);
    }

    getCategoryById(id: string, options: {}): Observable<any> {
        return this.gs.get(`category/${id}`, options);
    }

    updateCategory(id: string, data: any) {
        return this.gs.put(`category/${id}`, data);
    }

    deleteCategory(id: string): Observable<any> {
        return this.gs.delete(`category/${id}`);
    }
}
