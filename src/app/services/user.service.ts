import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  public token: string;
  constructor(private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  getUsers() {
    return this.http.get('/users')
      .map(res => res.json());
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
      const response = await this.http.post('api/user/updatememstime', {
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
      const response = await this.http.get('api/user/mems', {
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

  async checkAvailable(username: string): Promise<boolean> {
    try {
      const response = await this.http.get('api/user/available', {
        params: { username: username }
      }).toPromise();
      if (response.status === 200) {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
    return false;
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

  async getTestAsync(): Promise<string> {
    const response = await this.http.get('api/user/test').toPromise();
    console.log(response.json().message);
    return response.json().message;
  }
}
