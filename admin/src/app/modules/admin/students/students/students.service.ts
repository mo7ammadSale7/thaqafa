import { Injectable } from '@angular/core';
import { GenericService } from 'app/data/services/Generic.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    constructor(private gs: GenericService) { }
    filter: any = {};
    modelFilter: any = {};

    createStudent(data: any): Observable<any> {
        return this.gs.post('student', data);
    }

    getAllStudents(options: {}): Observable<any> {
        return this.gs.get('student', options);
    }

    getStudentById(id: string, options: {}): Observable<any> {
        return this.gs.get(`student/${id}`, options);
    }

    updateStudent(id: string, data: any) {
        return this.gs.put(`student/${id}`, data);
    }

    deleteStudent(id: string): Observable<any> {
        return this.gs.delete(`student/${id}`);
    }

    generateXLSX(filter: any): Observable<any> {
        return this.gs.get('student/generate-xlsx', filter);
    }
}
