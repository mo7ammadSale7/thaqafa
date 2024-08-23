import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';
import {Lesson} from "../models/Lesson";

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(private gs: GenericService) {}

  createLesson(data: Lesson ): Observable<any> {
    return this.gs.post('lesson', data);
  }

  getAllLessons(options: {}): Observable<any> {
    return this.gs.get('lesson', options);
  }

  getLessonById(id: string, options: {}): Observable<any> {
    return this.gs.get(`lesson/${id}`, options);
  }

  updateLesson(id: string, data: any) {
    return this.gs.put(`lesson/${id}`, data);
  }

  deleteLesson(id: string): Observable<any> {
    return this.gs.delete(`lesson/${id}`);
  }
}
