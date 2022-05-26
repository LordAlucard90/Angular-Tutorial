# Observables

## Content

- [Intro](#intro)
- [Using Observables](#using-observables)
- [Advanced Operations](#advanced-operations)

---

## Intro

An observable is a data source of various type: User Input (Events), HTTP Requests, etc..

The Observable/Observer pattern in used to implement the Observables logic.

The Observable emits events programmatically, by a button click event or by a HTTP request response and so on.

The Observer is implemented with the code in the subscribe method.

There are three method to handle the data packages received:

- **Handle Data** 
- **Handle Error** 
- **Handle Completion**


### Import


From version `rxjs: 6.x` the import syntax changed.
 
The new syntax will be introduced on the last videos,
but i will explore it first to directly write the recent one.

It is also possible use the old syntax style with the `rxjs-compat` package:

```bash
npm i rxjs@6 # course version
npm i rxjs-compat
```

### Syntax

Old syntax:
```typescript
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/Rx';
import 'rxjs/add/operator/do'

Observable.interval.map(...);
next.handle(red).do(...) // http section
```


New syntax:
```typescript
import {Subject, Observable, Observer, Subscription} from 'rxjs';
import {interval} from 'rxjs';
import {map, tap} from 'rxjs/operators';

interval.pipe(map(...));
next.handle(red).pipe(tap(...)) // do() was renamed to tap()
```

## Using Observables

###  Subscribing

It is possible to subscribe to the different data type in this way:

```typescript
.subscribe(
    data => {
        // Data
    },
    () => {
        // Error
    },
    () => {
        // Completion
    }.
);
```

### Creating An Observable

#### Interval Example

This is a simple interval observable subscription example:

```typescript
const myNumbers = interval(1000);
myNumbers.subscribe(
    (number: Number) => { console.log(number); }
);

```

##### Custom Observable

Is is possible create a simple custom Observable in this way:

```typescript
const observable = Observable.create((observer: Observer<number>) => {
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
    console.log(data);
});



const myObservable = Observable.create((observer: Observer<string>) => {
    setTimeout(() => { observer.next('first'); }, 2000);
    setTimeout(() => { observer.next('second'); }, 4000);
    setTimeout(() => {
        //   observer.error('this does not work');
        observer.complete();
    }, 5000);
    setTimeout(() => { observer.next('never reached'); }, 6000);
});
this.customSubscription = myObservable.subscribe(
    (data: String) => { console.log(data); },
    (error: String) => { console.log(error); },
    () => { console.log('Completed'); },
);
```

If the `error` or the `complete` signal is send the Observable is considered finish
and no more notification are emitted.

### Unsubscribing 

When a custom Observable is used, like `interval`, 
it will continue to create events even if the component is destroyed.

```typescript
import {..., Subscription} from 'rxjs';

export class HomeComponent implements OnInit, OnDestroy {
    // typescript strict configuration leads to undefined usage
    myNumbersSubscription: Subscription | undefined;
    customSubscription: Subscription | undefined;

    constructor() { }

    ngOnInit() {
        const myNumbers = interval(1000).pipe(
            map((data: number) => {
                return data * 2;
            }),
        );

        this.myNumbersSubscription = myNumbers.subscribe((number: Number) => {
            console.log(number);
        });

        const myObservable = Observable.create((observer: Observer<string>) => {
            // ...
        });
        this.customSubscription = myObservable.subscribe(
            // ...
        );
    }

    ngOnDestroy(): void {
        // typescript strict configuration with usage need (not null) type guards
        if (this.myNumbersSubscription) {
            this.myNumbersSubscription.unsubscribe();
        }
        if (this.customSubscription) {
            this.customSubscription.unsubscribe();
        }
    }
}
```

To correctly destroy an Observable is necessary to call `unsubscribe`
on the `ngOnDestroy` method.


## Advanced Operations

### Passing Data With Subject

A **Subject** is and an Observable and an Observer at the same time:
```typescript
export class UserService {
  userActivated = new Subject<number>();
}
```
usage:
```typescript
export class UserComponent implements OnInit {
  id: number = 0;

  constructor(private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {...}

  onActivate() {
    this.userService.userActivated.next(this.id);
  }
}
```
```typescript
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
```

It can be used to easily implement cross-component communication.

### Operators

An **Operator** allows to transform the data received
from the observable remaining in the observable,
it can be used on any Observable.

The complete list can be found on 
[learnrxjs](https://www.learnrxjs.io/learn-rxjs/operators).


Filter remove values that does not match,
Map remaps the input into something else:

```typescript
const myNumbers = interval(1000).pipe(
    filter((data: number) => {
        return data % 2 === 0;
    }),
    map((data: number) => {
        return data * 2;
    })
);
```

### Documentation

On [ReactiveX](http://reactivex.io/) web site it is possible 
to find more documentation about the api.

