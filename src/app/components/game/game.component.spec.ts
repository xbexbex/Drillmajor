import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';

import { LoginComponent } from '../login/login.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { UserService } from '../../services/user.service';

import { AppRoutingModule } from '../../app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatExpansionModule
} from '@angular/material';

describe('GameComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent, LoginComponent],
      imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatExpansionModule],
      providers: [UserService,
        { provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(GameComponent);
    const game = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GameComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
