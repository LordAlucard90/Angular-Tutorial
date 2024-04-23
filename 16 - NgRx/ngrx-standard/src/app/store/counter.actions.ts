import { Action } from "@ngrx/store";

export const COUNTER_INIT = '[Counter] Init';
export class InitAction implements Action {
  readonly type = COUNTER_INIT;
}

export const COUNTER_SET = '[Counter] Set';
export class SetAction implements Action {
  readonly type = COUNTER_SET;

  constructor(public payload: number) { }
}


export const COUNTER_INCREMENT = '[Counter] Increment';
export class IncrementAction implements Action {
  readonly type = COUNTER_INCREMENT;

  constructor(public payload: number) { }
}

export const COUNTER_DECREMENT = '[Counter] Decrement';
export class DecrementAction implements Action {
  readonly type = COUNTER_DECREMENT;

  constructor(public payload: number) { }
}

export type CounterActions = InitAction | SetAction | IncrementAction | DecrementAction;

