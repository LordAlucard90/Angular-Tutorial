import { Component, OnInit } from '@angular/core';

// old
// import {Observable} from 'rxjs/Observable';
// import {Observer} from 'rxjs/Observer';
// import {} from 'rxjs/';
// import "rxjs/Rx";

// Current
import {Observable, interval, Observer} from 'rxjs';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // const myNumbers = Observable.interval(1000) // Old
    // const myNumbers = interval(1000); // Current
    // myNumbers.subscribe(
    //   (number: Number) => {
    //     console.log(number);
    //   }
    // );

    const myObservable = Observable.create(
      (observer: Observer<string>) => {
        setTimeout(() => {
          observer.next('first package');
        }, 2000);
        setTimeout(() => {
          observer.next('second package');
        }, 4000);
        setTimeout(() => {
        //   observer.error('this does not work');
          observer.complete();
        }, 5000);
        setTimeout(() => {
          observer.next('third package');
        }, 6000);
      }
    );
    myObservable.subscribe(
      (data: String) => {console.log(data); },
      (error: String) => {console.log(error); },
      () => {console.log('Completed'); }
    );

  }

}
