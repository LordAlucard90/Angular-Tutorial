import { Action, createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const addIngredient = createAction(
    '[Shopping List] Add Ingredient',
    props<{ingredient: Ingredient}>()
);
export const addIngredients = createAction(
    '[Shopping List] Add Ingredients',
    props<{ingredients: Ingredient[]}>()
);
export const updateIngredient = createAction(
    '[Shopping List] Update Ingredient',
    props<{ingredient: Ingredient}>()
);
export const deleteIngredient = createAction(
    '[Shopping List] Delete Ingredient'
);
export const startEdit = createAction(
    '[Shopping List] Start Edit',
    props<{index: number}>()
);
export const stopEdit = createAction(
    '[Shopping List] Stop Edit'
);

// export const ADD_INGREDIENT = 'ADD_INGREDIENT';
// export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
// export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
// export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
// export const START_EDIT = 'START_EDIT';
// export const STOP_EDIT = 'STOP_EDIT';
//
// export class AddIngredient implements Action {
//     // type cannot be changed
//     readonly type: string = ADD_INGREDIENT;
//     // payload is not mandatory, also another name can be used
//     constructor(public payload?: Ingredient) {}
// }
//
// export class AddIngredients implements Action {
//     readonly type: string = ADD_INGREDIENTS;
//     constructor(public payload?: Ingredient[]) {}
// }
//
// export class UpdateIngredient implements Action {
//     readonly type: string = UPDATE_INGREDIENT;
//     // constructor(public payload?: { index: number; ingredient: Ingredient }) { }
//     constructor(public payload?: Ingredient) {}
// }
//
// export class DeleteIngredient implements Action {
//     readonly type: string = DELETE_INGREDIENT;
//     // constructor(public payload?: number) { }
//     constructor() {}
// }
//
// export class StartEdit implements Action {
//     readonly type: string = START_EDIT;
//     constructor(public payload?: number) {}
// }
//
// export class StopEdit implements Action {
//     readonly type: string = STOP_EDIT;
// }
//
// export type ShoppingListActions =
//     | AddIngredient
//     | AddIngredients
//     | UpdateIngredient
//     | DeleteIngredient
//     | StartEdit
//     | StopEdit;
