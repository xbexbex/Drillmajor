import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import binarySearch from 'binarysearch';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('gameFlyIn', [
      state('active', style({ opacity: 1, transform: 'translateX(0)' })),
      state('inactive', style({ opacity: 0, transform: 'translateX(0)' })),
      state('inactiveMenu', style({ opacity: 0, transform: 'translateY(0)' })),
      transition('inactive => active', [
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate('0.5s ease-in')
      ]),
      transition('active => inactive', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ]),
      transition('active => inactiveMenu', [
        animate('0.3s ease-out', style({
          opacity: 0,
          transform: 'translateY(100%)'
        }))
      ]),
      transition('inactiveMenu => active', [
        animate('0.3s', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ]),
    trigger('menuFlyIn', [
      state('active', style({ opacity: 1, transform: 'translateX(0)' })),
      state('inactive', style({ opacity: 0, transform: 'translateX(0)' })),
      transition('inactive => active', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.3s ease-in')
      ]),
      transition('active => inactive', [
        animate('0.3s ease-out', style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }))
      ])
    ]),
    trigger('gameMenuFlyIn', [
      state('active', style({ opacity: 1, transform: 'translateY(0)' })),
      state('inactive', style({ opacity: 0, transform: 'translateY(0)' })),
      state('inactiveMenu', style({ opacity: 0, transform: 'translateX(0)' })),
      transition('* => active', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('0.5s ease-in')
      ]),
      transition('active => inactive', [
        animate('0.1s ease-out', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ]),
      transition('active => inactiveMenu', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})

export class GameComponent implements OnInit {

  mems: Array<Mem>;
  averageLastTime: number;
  averageBestTime: number;
  gameState = 'inactive';
  menuState = 'active';
  gameMenuState = 'inactive';
  gameDisabled = true;
  menuDisabled = false;
  gameMenuDisabled = true;
  gameZindex = 0;
  menuZindex = 1;
  gameMenuZindex = 0;
  currentMem = <Mem>{ number: '00', lastTime: 0, bestTime: 0, name: 'sauce' };
  buttonNumber: string;
  currentMemIndex: number;
  memAmount: number;
  lastDate: number;
  lastTime: string;
  bestTime: string;
  turnForRandom = false;
  maximumMems = 111;
  gameMenuEnabled = true;
  timeDisplay = 'block';

  constructor(private userService: UserService, private router: Router) {
  }

  async ngOnInit() {
    const res = await this.userService.getMems();
    if (res === null) {
      this.userService.signOut();
      this.router.navigateByUrl('/login');
    }

    this.mems = new Array<Mem>();
    let bestSum = 0;
    let lastSum = 0;
    this.memAmount = 0;
    res.json().rows.forEach(mem => {
      const iMem = <Mem>{};
      iMem.name = mem.name;
      iMem.index = mem.index;
      iMem.lastTime = mem.last_time;
      iMem.bestTime = mem.best_time;
      iMem.number = mem.id;
      if (iMem.lastTime !== -1) {
        lastSum += iMem.lastTime;
        bestSum += iMem.bestTime;
        this.memAmount++;
      }
      this.mems.push(iMem);
    });

    if (this.memAmount !== 0) {
      this.averageLastTime = lastSum / this.memAmount;
      this.averageBestTime = bestSum / this.memAmount;
    } else {
      this.averageLastTime = -1;
      this.averageBestTime = -1;
    }
  }

  openGame() {
    this.gameState = 'active';
    this.gameDisabled = false;
    this.menuDisabled = true;
    this.menuState = 'inactive';
    this.menuZindex = 0;
    this.gameZindex = 1;
    this.timerStart();
  }

  openMenu() {
    this.gameMenuState = 'inactiveMenu';
    this.gameState = 'inactive';
    this.menuDisabled = false;
    this.gameMenuDisabled = true;
    this.menuState = 'active';
    this.menuZindex = 1;
    this.gameMenuZindex = 0;
  }

  openGameMenu(showTime: boolean) {
    if (showTime) {
      this.timeDisplay = 'block';
    } else {
      this.timeDisplay = 'none';
    }
    this.gameState = 'inactiveMenu';
    this.gameMenuDisabled = false;
    this.gameDisabled = true;
    this.gameMenuState = 'active';
    this.gameZindex = 0;
    this.gameMenuZindex = 1;
    this.timerEnd();
  }

  continueGame() {
    this.gameMenuState = 'inactive';
    this.gameState = 'active';
    this.gameMenuDisabled = true;
    this.gameDisabled = false;
    this.gameZindex = 1;
    this.gameMenuZindex = 0;
    this.timerStart();
  }

  gameClick() {
    if (this.gameMenuEnabled) {
      this.gameState = 'inactive';
      this.menuDisabled = false;
      this.gameDisabled = true;
      this.menuState = 'active';
      this.menuZindex = 1;
      this.gameZindex = 0;
    }
  }

  timerStart() {
    this.lastDate = Date.now();
    if (this.turnForRandom) {
      this.currentMemIndex = Math.floor(Math.random() * this.maximumMems);
    } else {
      this.currentMemIndex = 0;
    }
    this.buttonNumber = this.mems[this.currentMemIndex].number;
    this.turnForRandom = !this.turnForRandom;
  }

  async timerEnd() {
    const lastTimeNum = Math.round(Date.now() - this.lastDate);
    this.lastTime = this.timeToString(lastTimeNum);
    this.currentMem = this.mems[this.currentMemIndex];
    if (this.currentMem.lastTime == -1) {
      this.memAmount++;
      this.currentMem.bestTime = lastTimeNum;
      this.bestTime = this.lastTime;
    } else if (this.currentMem.lastTime < this.currentMem.bestTime) {
      this.currentMem.bestTime = lastTimeNum;
      this.bestTime = this.lastTime;
    } else {
      this.bestTime = this.timeToString(this.currentMem.bestTime);
    }
    this.currentMem.lastTime = lastTimeNum;
    this.averageLastTime = ((this.averageLastTime * (this.memAmount - 1)) + lastTimeNum) / this.memAmount; // still in progress
    this.currentMem.index = Math.max(0, 9999999 - lastTimeNum);
    this.mems.splice(this.currentMemIndex, 1);
    const index = this.bsSearch(this.mems, this.currentMem.index);
    this.mems.splice(index, 0, this.currentMem);
    this.userService.depositMem(this.currentMem.index, this.currentMem.lastTime, this.currentMem.bestTime, this.currentMem.number);
  }

  bsSearch(mems, memIndex) {
    const indices = [];
    mems.forEach(mem => {
      indices.push(mem.index);
    });
    const index = binarySearch.closest(indices, memIndex);
    if (index === 0) {
      return 1;
    } else {
      return index;
    }
  }

  signOut() {
    this.userService.signOut();
    this.router.navigateByUrl('/login');
  }

  timeToString(time: number) {
    let t = '' + time;
    t = t.substr(0, t.length - 1);
    if (t.length > 2) {
      t = t.substr(0, t.length - 2) + '.' + t.substr(t.length - 2);
    } else {
      t = '0.' + t;
    }
    /*     if (t.length > 5) {
          t = t.substr(0, t.length - 2) + ':' + t.substr(t.length - 4);
        } */
    return t;
  }

  stringToTime(time: string) {
    if (time.length > 2) {
      time = time.slice(0, time.length - 3) + time.slice(time.length - 2);
    } else {
      return parseInt(time, 10);
    }
  }
}

interface Mem {
  name: string;
  number: string;
  index: number;
  lastTime: number;
  bestTime: number;
}

