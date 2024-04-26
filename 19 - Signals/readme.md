# Signals

## Content

- [Intro](#intro)
- [Creation](#creation)
- [Modify Values](#modify-values)
- [Getting Value](#getting-value)
- [Computed](#computed)
- [Effects](#effects)

---

## Intro

By default Angular uses 
[zone.js](https://github.com/angular/angular/tree/main/packages/zone.js)
to detect if data changes and update the UI consequentially.
The data is defined using properties or methods inside the components 
and it is connected to the UI using the different data binding methods.

This approach is quite easy and the changes are detected automatically.
It is a convenient solution but the performance can be better and the size
of the application can be smaller without this dependency.

Signal, introduced in the v17, are an alternative to this approach that allow
to get rid of the extra library.\
With signal there is not anymore data changes automatic detection, but Angular
must be explicitly informed when data changes and where the UI must be updated.

With this approach there is more work to be done, but there are better
performances and smaller application size.

## Creation

A signal, of any type, can be created using the `signal` method

```typescript
import { Component, signal } from '@angular/core';

@Component({ /* ... */ })
export class DefaultComponent {
  // counter = 0; // old
  counter = signal(0);

  // ...
}
```

## Modify Values

Angular exposes three methods to update the property of a signal:
- `set`:\
directly takes the new value of the signal
- `update`:\
takes a function used to update the old value with a new one

An example of the update is:

```typescript
export class DefaultComponent {
  // actions: string[] = [];
  actions = signal<string[]>([]);
  // counter = 0;
  counter = signal(0);

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
```

The view will not yet automatically updated, to correctly update it, see below.


## Getting Value

A signal can not be simply used as it is, but it must be called as a method
to get its value, therefore the template will be

```angular2html
<!-- old -->
<!-- <p id="counter-output">Counter: {{ counter }}</p> -->
<!-- new -->
<p id="counter-output">Counter: {{ counter() }}</p>


<!-- old -->
<!-- <li *ngFor="let action of actions">{{ action }}</li> -->
<!-- new -->
<li *ngFor="let action of actions()">{{ action }}</li>
```

## Computed

Computed are signals that allows to create values that depend of other
signal values and update the easily

```typescript
import { computed, signal } from '@angular/core';
// ...
counter = signal(0);
doubleCounter = computed(() => this.counter() * 2)
```

In the template it can be called in the same way

```angular2html
<p id="counter-output">Double Counter: {{ doubleCounter() }}</p>
```


## Effects

One more listener connected to the signals it the `effect` method, the effect
is intended for performing an operation every time the value of the signal 
changes

```typescript
import { effect, signal } from '@angular/core';
// ...
counter = signal(0);
// ...
effect(() => console.log("Cur counter: ", this.counter()));
```

Interesting to note is that the effect takes place also when the signal is
defined the first time.

