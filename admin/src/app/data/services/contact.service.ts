import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private gs: GenericService) {}

  createContact(data: any): Observable<any> {
    return this.gs.post('contact', data);
  }

  getAllContacts(options: {}): Observable<any> {
    return this.gs.get('contact', options);
  }

  getContactById(id: string, options: {}): Observable<any> {
    return this.gs.get(`contact/${id}`, options);
  }

  getContactByName(name: string, options: {}): Observable<any> {
    return this.gs.get(`contact/name/${name}`, options);
  }

  updateContact(id: string, data: any) {
    return this.gs.put(`contact/${id}`, data);
  }

  deleteContact(id: string): Observable<any> {
    return this.gs.delete(`contact/${id}`);
  }
}
