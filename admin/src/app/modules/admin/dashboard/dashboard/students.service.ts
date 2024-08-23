import { Injectable } from '@angular/core';
import { GenericService } from 'app/data/services/Generic.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private gs: GenericService) { }
    filter: any = {};
    modelFilter: any = {};

    getYearsCount(options: {}): Observable<any> {
        return this.gs.get('student/years-count', options);
    }
}
