# Step02 - Using Observables

##  Subscribing

It is possible to subscribe to the different data type in this way:

```typescript
.subscribe(
    () => {
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

---

## Creating An Observable

#### Interval Example

This is a simple interval observable subscription example:

```typescript
const myNumbers = interval(1000);
myNumbers.subscribe(
  (number: Number) => {
    console.log(number);
  }
);

```

##### Custom Observable

Is is possible create a simple custom Observable in this way:

```typescript
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
```

If the `error` or the `complete` signal is send the Observable is considered finish and no more notification are emitted.

---

## Unsubscribing 

When a custom Observable is used, like `inverval` it will continue to create events even if the component is destroyed.

```typescript
import {..., Subscription} from 'rxjs';

export class HomeComponent implements OnInit, OnDestroy {
  myNumbersSubscription: Subscription;
  customSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    ...
    this.myNumbersSubscription = myNumbers.subscribe(...);

    const myObservable = Observable.create(...);
    this.customSubscription = myObservable.subscribe(...);
  }

  ngOnDestroy(): void {
    this.myNumbersSubscription.unsubscribe();
    this.customSubscription.unsubscribe();
  }
}
```

To correctly destroy an Observable is necessary to call `unsubscribe` on the `ngOnDestroy` method.




