import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  public token: string;
  constructor(private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  signOut() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  async login(username: string, password: string): Promise<number> {
    try {
      const response = await this.http.post('api/user/login', { username: username, password: password }).toPromise();
      const token = response.json() && response.json().token;
      if (token) {
        this.token = token;
        localStorage.setItem('currentUser', JSON.stringify({ token: token }));
      }
      return response.status;
    } catch (err) {
      console.log(err);
    }
    return 500;
  }

  async register(username: string, password: string): Promise<number> {
    try {
      const response = await this.http.post('api/user/register', { username: username, password: password }).toPromise();
      const token = response.json() && response.json().token;
      if (token) {
        this.token = token;
        localStorage.setItem('currentUser', JSON.stringify({ token: token }));
      }
      return response.status;
    } catch (err) {
      console.log(err);
    }
    return 500;
  }

  async depositMem(index: number, lastTime: number, bestTime: number, number: string): Promise<number> {
    try {
      const response = await this.http.post('api/user/mem/update', {
        token: this.token,
        id: number,
        lasttime: lastTime,
        besttime: bestTime,
        index: index
      }).toPromise();
      return response.status;
    } catch (err) {
      console.log(err);
    }
    return 500;
  }

  async getMems(): Promise<Response> {
    try {
      const response = await this.http.get('api/user/mem/get', {
        params: { token: this.token }
      }).toPromise();
      if (response.status === 200) {
        return response;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  checkAvailable(username: string): Observable<any> {
      return this.http.get('api/user/available', {
        params: { username: username }
      }).map(res => res.json());
  }

  async authenticate(): Promise<boolean> {
    try {
      if (localStorage.getItem('currentUser')) {
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.token);
        const response = await this.http.get('api/user/authenticate', { headers: headers }).toPromise();
        if (response.status === 200) {
          return true;
        }
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  }
}
