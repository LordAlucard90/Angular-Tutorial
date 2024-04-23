import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrement, increment, init, set } from "./counter.actions";
import { of, switchMap, tap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCount } from "./counter.selectors";

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions,
    private store: Store<{ counter: number }>) {
  }

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

  saveCount = createEffect(
    () => this.actions$.pipe(
      // defines the type of action
      ofType(increment, decrement),
      // add the return value to the next function
      withLatestFrom(this.store.select(selectCount)),
      // trigger a new action or just do something
      tap(([action, count]) => {
        console.log(count, action);
        localStorage.setItem('count', count.toString())
      })
      // tap(([action, count]) => {
      //   console.log(action);
      //   localStorage.setItem('count', action.amount.toString())
      // })
    ),
    { dispatch: false }
  );

}
