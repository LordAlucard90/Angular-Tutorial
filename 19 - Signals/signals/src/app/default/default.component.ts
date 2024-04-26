import { NgFor } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  standalone: true,
  imports: [NgFor],
})
export class DefaultComponent {
  // actions: string[] = [];
  actions = signal<string[]>([]);
  // counter = 0;
  counter = signal(0);
  doubleCounter = computed(() => this.counter() * 2)

  constructor() {
    effect(() => console.log("Cur counter: ", this.counter()));
  }


  increment() {
    // this.counter++;
    this.counter.update(old => old + 1);
    // this.actions.push('INCREMENT');
    this.actions.update(old => [...old, 'INCREMENT']);
  }

  decrement() {
    // this.counter--;
    this.counter.update(old => old - 1);
    // this.actions.push('DECREMENT');
    this.actions.update(old => [...old, 'DECREMENT']);
  }
}
