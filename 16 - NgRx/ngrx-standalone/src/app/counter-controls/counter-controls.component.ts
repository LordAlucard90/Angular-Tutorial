import { Component } from '@angular/core';

// import { CounterService } from '../counter.service';
import { Store } from '@ngrx/store';
import { decrement, increment } from '../store/counter.actions';

@Component({
  selector: 'app-counter-controls',
  templateUrl: './counter-controls.component.html',
  styleUrls: ['./counter-controls.component.css'],
  standalone: true,
})
export class CounterControlsComponent {
  constructor(private store: Store) { }

  increment() {
    this.store.dispatch(increment({ amount: 1 }));
  }

  decrement() {
    this.store.dispatch(decrement({ amount: 1 }));
  }
}
// export class CounterControlsComponent {
//   constructor(private counterService: CounterService) {}
//
//   increment() {
//     this.counterService.increment();
//   }
//
//   decrement() {
//     this.counterService.decrement();
//   }
// }
