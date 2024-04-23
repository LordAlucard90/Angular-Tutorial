import { Action } from "@ngrx/store";
import { COUNTER_DECREMENT, COUNTER_INCREMENT,COUNTER_SET, CounterActions, DecrementAction, IncrementAction, SetAction } from "./counter.actions";

const initialState = 0

export function counterReducer(state = initialState, action: CounterActions | Action) {
  if (action.type === COUNTER_INCREMENT) {
    return state + (action as IncrementAction).payload;
  }
  if (action.type === COUNTER_DECREMENT) {
    return state - (action as DecrementAction).payload;
  }
  if (action.type === COUNTER_SET) {
    return (action as SetAction).payload;
  }
  return state;
}

