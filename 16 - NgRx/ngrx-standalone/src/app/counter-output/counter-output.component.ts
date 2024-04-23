import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// import { CounterService } from '../counter.service';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectCount, selectDoubleCount } from '../store/counter.selectors';

@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css'],
  standalone: true,
  imports: [AsyncPipe]
})
export class CounterOutputComponent {
  count$: Observable<number>;
  doubleCount$: Observable<number>;

  constructor(private store: Store<{ counter: number }>) {
    // this.count$ = store.select('counter');
    this.count$ = store.select(selectCount);
    this.doubleCount$ = store.select(selectDoubleCount);
  }
}
// export class CounterOutputComponent implements OnInit, OnDestroy {
//   counter = 0;
//   counterServiceSub?: Subscription;
//
//   constructor(private counterService: CounterService) {}
//
//   ngOnInit(): void {
//     this.counterServiceSub = this.counterService.counterChanged.subscribe(
//       (newVal) => (this.counter = newVal)
//     );
//   }
//
//   ngOnDestroy(): void {
//     if (this.counterServiceSub) {
//       this.counterServiceSub.unsubscribe();
//     }
//   }
// }
