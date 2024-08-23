import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TagService {
    constructor(private gs: GenericService) { }

    createTag(data: any): Observable<any> {
        return this.gs.post('tag', data);
    }

    getAllTags(options: {}): Observable<any> {
        return this.gs.get('tag', options);
    }

    getTagById(id: string, options: {}): Observable<any> {
        return this.gs.get(`tag/${id}`, options);
    }

    updateTag(id: string, data: any) {
        return this.gs.put(`tag/${id}`, data);
    }

    deleteTag(id: string): Observable<any> {
        return this.gs.delete(`tag/${id}`);
    }
}
