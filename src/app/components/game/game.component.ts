import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  title = 'app';
  message: string;

  mems: Array<any>;
  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.message = await this.userService.getTestAsync();
  }
}

