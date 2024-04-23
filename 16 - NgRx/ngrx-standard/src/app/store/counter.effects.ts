import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, switchMap, tap, withLatestFrom } from "rxjs";
import { COUNTER_DECREMENT, COUNTER_INCREMENT, COUNTER_INIT, SetAction, DecrementAction, IncrementAction } from "./counter.actions";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCount } from "./counter.selectors";

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions,
              private store: Store<{counter: number}>) {
  }

  loadCount = createEffect(
    () => this.actions$.pipe(
      ofType(COUNTER_INIT),
      switchMap(() => {
        const storedCount = localStorage.getItem('count');
        if (storedCount) {
          return of(new SetAction(+storedCount));
        }
        return of(new SetAction(0));
      })
    )
  )

  saveCountIncrement = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(COUNTER_INCREMENT),
      // add the return value to the next function
      withLatestFrom(this.store.select(selectCount)),
      tap(([action, count]) => {
        console.log(count, action);
        localStorage.setItem('count', count.toString())
      })
      // tap((action) => {
      //   console.log(action);
      //   localStorage.setItem('count', (action as IncrementAction).payload.toString())
      // })
    ),
    { dispatch: false }
  );

  saveCountDecrement = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(COUNTER_DECREMENT),
      // add the return value to the next function
      withLatestFrom(this.store.select(selectCount)),
      tap(([action, count]) => {
        console.log(count, action);
        localStorage.setItem('count', count.toString())
      })
      // tap((action) => {
      //   console.log(action);
      //   localStorage.setItem('count', (action as DecrementAction).payload.toString())
      // })
    ),
    { dispatch: false }
  );
}
