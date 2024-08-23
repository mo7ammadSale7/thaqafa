import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';
import {Enrollment} from "../models/Enrollment";

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private gs: GenericService) {}

  createEnrollment(data: Enrollment): Observable<any> {
    return this.gs.post('enrollment', data);
  }

  getAllEnrollments(options: {}): Observable<any> {
    return this.gs.get('enrollment', options);
  }

  getEnrollmentById(id: string, options: {}): Observable<any> {
    return this.gs.get(`enrollment/${id}`, options);
  }

  updateEnrollment(id: string, data: any) {
    return this.gs.put(`enrollment/${id}`, data);
  }

  deleteEnrollment(id: string): Observable<any> {
    return this.gs.delete(`enrollment/${id}`);
  }
}
