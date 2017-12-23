import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

describe('UserService', () => {
  let subject;
  let backend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(mockBackend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }]
    });
  });

  beforeEach(inject([UserService, MockBackend], (userService, mockBackend) => {
    subject = userService;
    backend = mockBackend;
  }));

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should connect properly with http', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const options = new ResponseOptions({ status: 200 });
      connection.mockRespond(new Response(options));
    });
    subject.login('asdf', 'asdf').then((response) => {
      expect(response).toEqual(200);
      done();
    });
  });
});
