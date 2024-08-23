import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private gs: GenericService) {}

  createPage(data: any): Observable<any> {
    return this.gs.post('page', data);
  }

  getAllPages(options: {}): Observable<any> {
    return this.gs.get('page', options);
  }

  getPageById(id: string, options: {}): Observable<any> {
    return this.gs.get(`page/${id}`, options);
  }

  getPageByName(name: string, options: {}): Observable<any> {
    return this.gs.get(`page/name/${name}`, options);
  }

  updatePage(id: string, data: any) {
    return this.gs.put(`page/${id}`, data);
  }

  deletePage(id: string): Observable<any> {
    return this.gs.delete(`page/${id}`);
  }

  getDashboardCounts(options: {}): Observable<any> {
    return this.gs.get('page/dashboard', options);
  }
}
