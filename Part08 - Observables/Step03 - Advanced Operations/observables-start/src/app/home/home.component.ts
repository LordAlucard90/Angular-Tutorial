import {Component, OnDestroy, OnInit} from '@angular/core';

// Old
// import {Observable} from 'rxjs/Observable';
// import {Observer} from 'rxjs/Observer';
// import {Subscription} from 'rxjs/Subscription';
// import "rxjs/Rx";

// Current
import {Observable, interval, Observer, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  myNumbersSubscription: Subscription;
  customSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    // Old
    // const myNumbers = Observable.interval(1000)
    //   .map((data: number) => {
    //     return data * 2;
    //   }
    // );

    // Current
    const myNumbers = interval(1000).pipe(
      map((data: number) => {
        return data * 2;
      })
    );

    this.myNumbersSubscription = myNumbers.subscribe(
      (number: Number) => {
        console.log(number);
      }
    );

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
    this.customSubscription = myObservable.subscribe(
      (data: String) => {console.log(data); },
      (error: String) => {console.log(error); },
      () => {console.log('Completed'); }
    );

  }

  ngOnDestroy(): void {
    this.myNumbersSubscription.unsubscribe();
    this.customSubscription.unsubscribe();
  }
}
