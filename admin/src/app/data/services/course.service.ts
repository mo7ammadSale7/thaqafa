import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';
import {Course} from "../models/Course";

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private gs: GenericService) {}

  createCourse(data: Course ): Observable<any> {
    return this.gs.post('course', data);
  }

  getAllCourses(options: {}): Observable<any> {
    return this.gs.get('course', options);
  }

  getCourseById(id: string, options: {}): Observable<any> {
    return this.gs.get(`course/${id}`, options);
  }

  updateCourse(id: string, data: any) {
    return this.gs.put(`course/${id}`, data);
  }

  deleteCourse(id: string): Observable<any> {
    return this.gs.delete(`course/${id}`);
  }
}
