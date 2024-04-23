import { createAction, props } from "@ngrx/store";

export const init = createAction(
  '[Counter] Init'
)

export const set = createAction(
  '[Counter] Set',
  props<{amount: number}>()
)

export const increment = createAction(
  '[Counter] Increment',
  props<{amount: number}>()
);

export const decrement = createAction(
  '[Counter] Decrement',
  props<{amount: number}>()
);


