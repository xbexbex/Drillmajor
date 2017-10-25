import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
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

  async login(username: string, password: string): Promise<number> {
    try {
      const response = await this.http.post('api/user/login', { username: username, password: password }).toPromise();
      const token = response.json() && response.json().token;
      if (token) {
        this.token = token;
        localStorage.setItem('currentUser', JSON.stringify({ token: token }));
      }
      return response.json().status;
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
      return response.json().status;
    } catch (err) {
      console.log(err);
    }
    return 500;
  }

  async getMems() {
    if (localStorage.getItem('currentUser')) {
      return this.http.get('api/users/mems')
        .map(res => res.json());
    }
  }

  async checkAvailable(username: string): Promise<boolean> {
    try {
      const response = await this.http.get('api/user/available', {
        params: { username: username }
      }).toPromise();
      if (response.json().status === 200) {
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
        const response = await this.http.get('api/user/authenticate', {
          params: { Authorization: 'Bearer ' + localStorage.getItem('currentUser') }
        }).toPromise();
        if (response.json().status === 200) {
          console.log(response.json().message);
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
