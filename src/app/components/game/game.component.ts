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
  
  mems: Array<Mem>;
  constructor(private userService: UserService) { }
  
  async ngOnInit() {
/*     const res = await this.userService.getMems();
    res.results.forEach(element => {
      list.push(element.Id);
    }); */
    console.log(await this.userService.getMems());
  }
}
  
  interface Mem {
    name: String;
    number: Number;
    index: Number;
    lastTime: Number;
    bestTIme: Number;
}

