import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  public token: string;
  constructor(private http: Http) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  getUsers() {
    return this.http.get('/users')
      .map(res => res.json());
  }

  isValid() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
  }

  loginOld(username: string, password: string): Observable<boolean> {
    return this.http.post('api/authenticate', JSON.stringify({ username: username, password: password }))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          const userId = response.json().userId;
          const userName = response.json().userName;
          // store userId and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ userId: userId, userName: userName, token: token }));
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });
  }

  async login(username: string, password: string): Promise<boolean> {
    const response = await this.http.post('api/user/login', { username: username, password: password }).toPromise();
    const token = response.json() && response.json().token;
    if (token) {
      // set token property
      this.token = token;
      const userId = response.json().userId;
      const userName = response.json().userName;
      // store userId and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify({ userId: userId, userName: userName, token: token }));
      // return true to indicate successful login
      return true;
    } else {
      // return false to indicate failed login
      return false;
    }
  }

  async register(username: string, password: string): Promise<boolean> {
    const response = await this.http.post('api/user/register', { username: username, password: password }).toPromise();
    const token = response.json() && response.json().token;
    if (token) {
      // set token property
      this.token = token;
      const userId = response.json().userId;
      const userName = response.json().userName;
      // store userId and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify({ userId: userId, userName: userName, token: token }));
      // return true to indicate successful login
      return true;
    } else {
      // return false to indicate failed login
      return false;
    }
  }

  async getMems() {
    if (localStorage.getItem('currentUser')) {
      return this.http.get('api/users/mems')
        .map(res => res.json());
    }
  }

  async checkAvailable(username: string) {
    try {
      const response = await this.http.get('api/user/available', {
        params: {username: username}}).toPromise();
      if (response.json().status === 200) {
        return true;
      }
    } catch (err) {
      return err;
    }
    return false;
  }

  async getTestAsync(): Promise<string> {
    const response = await this.http.get('api/user/test').toPromise();
    console.log(response.json().message);
    return response.json().message;
  }
}
