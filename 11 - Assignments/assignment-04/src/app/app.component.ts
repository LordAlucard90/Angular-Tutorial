import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  oddsEmitted: number[] = [];
  evensEmitted: number[] = [];

  onNumberEmitted(emittedNumber: number) {
    if (emittedNumber % 2 === 0){
      this.evensEmitted.push(emittedNumber);
    } else {
      this.oddsEmitted.push(emittedNumber);
    }
  }
}
