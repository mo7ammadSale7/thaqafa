import { Injectable } from '@angular/core';
import { GenericService } from './Generic.service';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private gs: GenericService, private jwtHelper: JwtHelperService) {}

  login(data: any): Observable<any> {
    return this.gs.post('user/login', data);
  }

  isLoggedIn(token: any): boolean {
    if (!token) {
      return false;
    }

    const decodedToken = this.jwtHelper.decodeToken(token);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);

    return !isExpired;
  }

  hasRole(expectedRoles: any, token: any): boolean {
    if (!token) {
      return false;
    }

    if (!expectedRoles) {
      return true;
    }

    const decodedToken = this.jwtHelper.decodeToken(token);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);

    return !isExpired && expectedRoles.includes(decodedToken.role);
  }

}
