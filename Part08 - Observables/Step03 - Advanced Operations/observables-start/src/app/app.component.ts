import {Component, OnInit} from '@angular/core';
import {UserService} from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  user1Activated = false;
  user2Activated = false;

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.userService.userActivated.subscribe(
      (id: number) => {
        if (id === 1){
          this.user1Activated = true;
        } else {
          this.user2Activated = true;
        }
      }
    );
  }
}
