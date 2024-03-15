import { Component, OnDestroy, OnInit } from '@angular/core';

// Old
// import {Observable} from 'rxjs/Observable';
// import {Observer} from 'rxjs/Observer';
// import {Subscription} from 'rxjs/Subscription';
// import "rxjs/Rx";

// Current
import { Observable, interval, Observer, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
    observableSubscription: Subscription | undefined;
    myNumbersSubscription: Subscription | undefined;
    customSubscription: Subscription | undefined;

    constructor() { }

    ngOnInit() {
        // Old old
        // const myNumbers = Observable.interval(1000)
        //   .map((data: number) => {
        //     return data * 2;
        //   }
        // );

        // Old
        // const observable = Observable.create((observer: Observer<number>) => {...});

        // Current
        const observable = new Observable((observer: Observer<number>) => {
            let count = 0;
            setInterval(() => {
                observer.next(count);
                if (count > 3) {
                    observer.error(new Error('Grater than 3.'));
                }
                count++;
            }, 1000);
        });
        this.observableSubscription = observable.subscribe((data: number) => {
            console.log("Observable:", data);
        });

        const myNumbers = interval(1000).pipe(
            filter((data: number) => {
                return data % 2 === 0;
            }),
            map((data: number) => {
                return data * 2;
            }),
        );

        this.myNumbersSubscription = myNumbers.subscribe((number: Number) => {
            console.log("My numbers:", number);
        });

        const myObservable = new Observable((observer: Observer<string>) => {
            setTimeout(() => {
                observer.next('first package');
            }, 2000);
            setTimeout(() => {
                observer.next('second package');
            }, 4000);
            setTimeout(() => {
                  // observer.error('this does not work');
                observer.complete();
            }, 5000);
            setTimeout(() => {
                observer.next('third package');
            }, 6000);
        });
        this.customSubscription = myObservable.subscribe(
            (data: String) => {
                console.log("Custom:", data);
            },
            (error: String) => {
                console.log("Custom error:", error);
            },
            () => {
                console.log("custom:", 'Completed');
            },
        );
    }

    ngOnDestroy(): void {
        if (this.observableSubscription) {
            this.observableSubscription.unsubscribe();
        }
        if (this.myNumbersSubscription) {
            this.myNumbersSubscription.unsubscribe();
        }
        if (this.customSubscription) {
            this.customSubscription.unsubscribe();
        }
    }
}
