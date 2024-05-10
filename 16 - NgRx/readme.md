# NgRx 

In the original course this topic was added to the course project, in a new 
version it was done more abstract therefore I rewrote the section.\
Nevertheless, I kept the code in the 
[Project Versions](../30%20-%20Course%20Project%20Versions/).


## Content

- [Intro](#intro)
- [Installation](#installation)
- [Redux Devtools](#redux-devtools)
- [Reducer](#reducer)
- [Selector](#selector)
- [Action](#action)
- [Passing Data To Actions](#passing-data-to-actions)
- [Effect](#effect)
- [Specific Pipe Operators](#specific-pipe-operators)
- [Router Store](#router-store)

---

## Intro

NgRx implements the Redux pattern.

Basically NgRx is a state management solution that help to manage complex 
states that can be used instead of managing it inside services and components.

The idea is to have a global `store` accessed by the services and components
using `selectors`. The data in the store can be changed by services and components
using `actions` that triggers `reducers` that contains the logic to actually 
change the data in the store.\
Beside this there are also `effects` that are triggered by actions that are 
basically side effects that should be triggered when an action occurs.

```
    +------------+        +=================+
    |  Selector  |--------I      Store      I
    +------------+        +=================+
          |                        ^    
          |                        |   
          |                   +---------+
          |                   | Reducer |
          |                   +---------+
          |                        |   
          v                        |   
 +=================+          +---------+          +--------+
 I    Component    I----------| Actions |----------| Effect |
 +=================+          +---------+          +--------+
```


## Installation

The store dependency can be added using:
```bash
ng add @ngrx/store
```

### Standard

In a standard project, after this command the dependency will be added to the 
`package.json` and the `StoreModule` will be added in the `AppModule`

```typescript
@NgModule({
  // ...
  imports: [
    // ...
    StoreModule.forRoot({}, {})
  ],
})
export class AppModule {}
```

The `StoreModule` is responsible to menage the store in the application, by 
default it is empty.

### Standalone

On the other hand, in a standalone project, the dependency sill be added in the
`main.ts` file:

```typescript
bootstrapApplication(AppComponent, {
    providers: [provideStore()]
});
```

Also in this case is created an empty store.

## Redux Devtools

It is possible to install a Chrome / Firefox browser extension 
[redux-devtools](https://github.com/reduxjs/redux-devtools)
that in combination with the dev dependency

```bash
ng add @ngrx/store-devtools
```
and a configuration in the app module for standard project
```typescript
import { isDevMode } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  // ...
  imports: [
    // ...
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  // ...
})
export class AppModule {}
```
or in standalone project
```typescript
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    // ...
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
});
```
Allows to see the store and its changes in the Redux tab of the browser
development tools.


## Reducer

The reduces manages the state update and basically contains the current state,
therefore when it is declared it need also the initial state that can be of
any type

```typescript
import { createReducer } from "@ngrx/store";

const initialState = 0

export const counderReducer = createReducer(initialState);
```

### Standard

In a standard project the reducer must then be connected with the `StoreModule`.
The key of the reducer is totally free, and different keys that then be connected
to different stores, allowing a quite dynamic store definition.

```typescript
import { counderReducer } from './store/counter.reducer';

@NgModule({
  // ...
  imports: [
    // ...
    StoreModule.forRoot({
      counter: counderReducer
    })
  ],
})
export class AppModule {}
```

### Standalone

In a standalone project, the reducer must be defined in the `provideStore`.
As in the previous solution the configuration of the store is up to the needs
of the application.

```typescript
import { counderReducer } from './store/counter.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({
      counter: counderReducer
    })
  ]
});
```

### Reducer Function

An alternative way, and supported by older version, to create the reducer 
function, is to do it explicitly

```typescript
export function counderReducer(state = initialState) {
  return state;
}
```

The reducer function is just a function that takes the current states and 
returns the new state, by default, the `initialState` can be returned.


## Selector

The data from the store can be retrieved using a selector with the `select`
method

```typescript
export class CounterOutputComponent {
  count$: Observable<number>;

  constructor(private store: Store<{counter: number}>) {
    this.count$ = store.select('counter')
  }
}
```

Since the return type is an `Observable`, it can be subscribed/destroyed or
can be used the `async` pipe

```angular2html
<p class="counter">{{ count$ | async }}</p>
```

In the standalone component, the `AsynPipe` must be explicitly imported.

### Advanced selectors

A more powerful way to define selectors is using a function, this function will
get the whole application state and will return the wanted state

```typescript
export const selectCount = (state: {counter: number}) => state.counter;
export const selectDoubleCount = (state: {counter: number}) => state.counter * 2;
```

This approach allows to define the way to access the state in a centralized
and secure place.

Last but not least, they can be simply used in this way

```typescript
export class CounterOutputComponent {
  count$: Observable<number>;
  doubleCount$: Observable<number>;

  constructor(private store: Store<{counter: number}>) {
    // this.count$ = store.select('counter')
    this.count$ = store.select(selectCount);
    this.doubleCount$ = store.select(selectDoubleCount);
  }
}
```

### Concatenating Selectors

It is also possible to create new selectors starting from old ones, each one
will get as input the result of the previous one

```typescript
import { createSelector } from "@ngrx/store";

export const selectCount = (state: {counter: number}) => state.counter;
export const selectDoubleCount = createSelector(
  selectCount,
  (state: number) => state * 2
)
```

## Action

An action represent soma change of the state of the store, it is defined as 
a function that takes as first parameter the name.
This name should be unique across different store and for this reason usually
it is appended the `[StoreType]`

```typescript
import { createAction } from "@ngrx/store";

export const increment = createAction(
  '[Counter] Increment'
);

export const decrement = createAction(
  '[Counter] Decrement'
);
```

In order to make the store state change the action must be connected with the
reducer using the `on` method.
It takes the corresponding action and a function that must return a new instance
of the state. It is important that the state is a new object and not the same
one modified.

```typescript
import { createReducer, on } from "@ngrx/store";
import { increment, decrement } from "./counter.actions";

const initialState = 0

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1)
);
```

Finally it is possible to dispatch an action using the `dispatch` method on the
call of the action 

```typescript
export class CounterControlsComponent {
  constructor(private store: Store) {}

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement()):
  }
}
```

### Action Class

An alternative way, and supported by older version, to create the action by
extending the `Action` interface

```typescript
import { Action } from "@ngrx/store";

export const COUNTER_INCREMENT = '[Counter] Increment';
export const COUNTER_DECREMENT = '[Counter] Decrement';

export class IncrementAction implements Action {
  readonly type = COUNTER_INCREMENT;
}

export class DecrementAction implements Action {
  readonly type = COUNTER_DECREMENT;
}

export type CounterActions = IncrementAction | DecrementAction;
```

The alternative way to pass data to the reducer uses a second action paramer


```typescript
import { Action } from "@ngrx/store";
import { COUNTER_INCREMENT, CounterActions, IncrementAction } from "./counter.actions";

const initialState = 0

export function counterReducer(state = initialState, action: CounterActions | Action) {
  if (action.type === COUNTER_INCREMENT) {
    return state + 1;
  }
  if (action.type === COUNTER_DECREMENT) {
    return state - 1;
  }
  return state;
}
```

It is necessary to use `| Action` because the reducer will be called also when
actions coming from other stores are triggered.

Finally it is possible to trigger the action by passing to the dispatch
method a new action instance

```typescript
this.store.dispatch(new IncrementAction());
this.store.dispatch(new DecrementAction());
```


## Passing Data To Actions

It is possible to pass data to an action by using the `props` method, that 
is a genetic method that takes an object that represent the data needed by
the action

```typescript
import { createAction, props } from "@ngrx/store";

export const increment = createAction(
  '[Counter] Increment',
  props<{amount: number}>()
);

export const decrement = createAction(
  '[Counter] Decrement',
  props<{amount: number}>()
);
```

In the reducer the data can then be retrieved by the `action` parameter.

```typescript
export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.amount),
  on(decrement, (state, action) => state - action.amount)
);
```

By default the action parameter has also a `type` property that contains the 
action's name.

### Action Class

In the alternative way data can be passed in the constructor

```typescript
// ...
export class IncrementAction implements Action {
  readonly type = COUNTER_INCREMENT;

  constructor(public payload: number) { }
}

export class DecrementAction implements Action {
  readonly type = COUNTER_DECREMENT;

  constructor(public payload: number) { }
}
// ...
```

The reducer need a cast to access the action data

```typescript
export function counterReducer(state = initialState, action: CounterActions | Action) {
  if (action.type === COUNTER_INCREMENT) {
    return state + (action as IncrementAction).payload;
  }
  if (action.type === COUNTER_DECREMENT) {
    return state - (action as DecrementAction).payload;
  }
  return state;
}
```

The action parameter(s) can be simply passed during the action's creation

```typescript
this.store.dispatch(new IncrementAction(1));
this.store.dispatch(new DecrementAction(1));
```

## Effect

An effect, is some sort of side effect that is not directly related to an UI
update, for example send an http request, storing data in the local storage
or logging something.

The reducers should not have any asynchronous call, all the code there should
be synchronous. Also logging in the reducers and managing the store is not 
a best practice. The reducers should the concentrate only on the state update.

Nevertheless, when the state changes it can be necessary or wanted some sort
of asynchronous interaction, like storing the data in the local store or in
a database accessible in the back-end. Therefore this kind of interactions
should be managed by the effects.

### Install

The effects are shipped in a separate dependency, that can be added to the 
project with

```bash
ng add @ngrx/effects
```

In a standard project the `EffectsModule` is added to the `AppModule`

```typescript
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  // ...
  imports: [
    // ...
    EffectsModule.forRoot([])
  ],
})
export class AppModule { }
```

While in a standalone one, in the `main.ts`

```typescript
import { provideEffects } from '@ngrx/effects';

bootstrapApplication(AppComponent, {
    // ...
    provideEffects()
]
});
```

Note: it has a problem with typescript version `5.4.2`, I downgraded to `5.3.3`.

### Creation

An effect can dispatch a new action, for example after fetching something from
a back-end, or not, for example when storing data to the local store.

In general an effect can be create by creating a class that takes in the 
constructor an action `Observable` an exposes list of methods that represent
effects.


The different effects has to pipe the action `Observable` and filter the
actions, to which react, using the `ofType` function.

```typescript
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrement, increment } from "./counter.actions";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions) { }

  saveCount = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(increment, decrement),
      tap((action) => {
        console.log(action);
        localStorage.setItem('count', action.amount.toString())
      })
    ),
    { dispatch: false }
  );
}
```

If the effect will not trigger an action at the end of the execution, it is 
necessary to set the property `dispatch` to false.


In older versions of Angular there was the `@Effect` annotation that now is not
anymore available.

In the alternative way to use NgRx, the effects will look in this way

```typescript
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";
import { COUNTER_DECREMENT, COUNTER_INCREMENT, DecrementAction, IncrementAction } from "./counter.actions";
import { Injectable } from "@angular/core";

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions) { }

  saveCountIncrement = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(COUNTER_INCREMENT),
      tap((action) => {
        console.log(action);
        localStorage.setItem('count', (action as IncrementAction).payload.toString())
      })
    ),
    { dispatch: false }
  );

  saveCountDecrement = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(COUNTER_DECREMENT),
      tap((action) => {
        console.log(action);
        localStorage.setItem('count', (action as DecrementAction).payload.toString())
      })
    ),
    { dispatch: false }
  );
}
```

### Registration

The effect can be registered in the standard approach using the `EffectsModule`

```typescript
import { CounterEffects } from './store/counter.effects';

@NgModule({
  // ...
  imports: [
    // ...
    EffectsModule.forRoot([CounterEffects])
  ],
})
export class AppModule { }
```

While in a standalone one, it is added to the `provideEffects` function

```typescript
import { CounterEffects } from './store/counter.effects';

bootstrapApplication(AppComponent, {
    // ...
    provideEffects([CounterEffects])
]
});
```

### Trigger Other Actions

Effects can generate async interactions, or deal with the localStorage,
after this interaction can be needed to update the store status by triggering
a new action.

This can be done using the `switchMap` operator and returning the new action
wrapper inside the `of` operator

```typescript
loadCount = createEffect(
  () => this.actions$.pipe(
    ofType(init),
    switchMap(() => {
      const storedCount = localStorage.getItem('count');
      if (storedCount) {
        return of(set({ amount: +storedCount}));
      }
      return of(set({ amount: 0}));
    })
  )
)
```


## Specific Pipe Operators

Here follows a list of function for `pipe` that are specific for the NgRx
use cases.


### ofType

It is used to filter out all the actions that are not in the list

```typescript
saveCount = createEffect(
  () => this.actions$.pipe(
    ofType(increment, decrement),
    // ...
  )
)
```

### withLatestFrom

It allows to retrieve the latest value present in the store and add it to the
parameters passed to the next function

```typescript
saveCount = createEffect(
  () => this.actions$.pipe(
    ofType(increment, decrement),
    withLatestFrom(this.store.select(selectCount)),
    tap(([action, count]) => {
      console.log(action);
      localStorage.setItem('count', count.toString())
    })
  )
)
```

### switchMap And of

`switchMap` allows to switch to a new Observable chain, it is used in 
combination with `of` because of creates an Observable of the wrapper data
that with the effects is a new action to dispatch.

```typescript
loadCount = createEffect(
  () => this.actions$.pipe(
    ofType(init),
    switchMap(() => {
      const storedCount = localStorage.getItem('count');
      if (storedCount) {
        return of(set({ amount: +storedCount}));
      }
      return of(set({ amount: 0}));
    })
  )
)
```

## Router Store

The router store is a tool that allows to react to routing actions,
it dispatch automatically actions based on the router.

The needed package is:
```bash
npm i @ngrx/router-store
```
then it must be configured in the app module:
```typescript
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        StoreRouterConnectingModule.forRoot(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

Similar configuration is available for standalone projects.

### Events

The events dispatched by the router store are:
-`@ngrx/router-store/request`: navigation started
-`@ngrx/router-store/navigation`: navigation in progress
-`@ngrx/router-store/navigated`: navigation finished
the payload is composed by the router state and the ending route.

It is possible to analyze these events with the Redux Devtools.

