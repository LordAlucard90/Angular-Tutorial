import { createReducer, on } from "@ngrx/store";
import { decrement, increment, init, set } from "./counter.actions";
import { state } from "@angular/animations";

const initialState = 0

export const counterReducer = createReducer(
  initialState,
  // on(increment, (state) => state + 1),
  on(increment, (state, action) => state + action.amount),
  // on(decrement, (state) => state - 1)
  on(decrement, (state, action) => state - action.amount),
  on(set, (_, action) => action.amount)
);

