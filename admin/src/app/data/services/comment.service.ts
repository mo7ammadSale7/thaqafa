import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(private gs: GenericService) { }

    createComment(data: any): Observable<any> {
        return this.gs.post('comment', data);
    }

    getAllComments(options: {}): Observable<any> {
        return this.gs.get('comment', options);
    }

    getCommentById(id: string, options: {}): Observable<any> {
        return this.gs.get(`comment/${id}`, options);
    }

    updateComment(id: string, data: any) {
        return this.gs.put(`comment/${id}`, data);
    }

    deleteComment(id: string): Observable<any> {
        return this.gs.delete(`comment/${id}`);
    }
}
