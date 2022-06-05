import { createReducer, createSelector, on } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient?: Ingredient;
    editedIngredientIndex?: number;
}

export interface AppState {
    shoppingList: State;
}

export const selectShoppingList = (state: AppState) => state.shoppingList;

export const selectShoppingListIngredients = createSelector(
    selectShoppingList,
    (state: State) => state.ingredients,
);

const initialState: State = {
    ingredients: [new Ingredient('First', 3), new Ingredient('Second', 5)],
};

export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, { ingredient }) => {
        return {
            ...state,
            ingredients: [...state.ingredients, ingredient],
        };
    }),
    on(ShoppingListActions.addIngredients, (state, { ingredients }) => {
        return {
            ...state,
            ingredients: [...state.ingredients, ...ingredients],
        };
    }),
    on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
        if (state.editedIngredientIndex === undefined) {
            return state;
        }
        const oldIngredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
            ...oldIngredient,
            ...ingredient,
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
        console.log({
            ...state,
            ingredients: updatedIngredients,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        });
        return {
            ...state,
            ingredients: updatedIngredients,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
    on(ShoppingListActions.deleteIngredient, state => {
        if (state.editedIngredientIndex === undefined) {
            return state;
        }
        return {
            ...state,
            ingredients: state.ingredients.filter((ingredient, index) => {
                return index !== state.editedIngredientIndex;
            }),
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
    on(ShoppingListActions.startEdit, (state, { index }) => {
        return {
            ...state,
            editedIngredientIndex: index,
            editedIngredient: { ...state.ingredients[index] },
        };
    }),
    on(ShoppingListActions.stopEdit, state => {
        return {
            ...state,
            editedIngredientIndex: undefined,
            editedIngredient: undefined,
        };
    }),
);

// export function _shoppingListReducer(
//     state: State = initialState,
//     action: ShoppingListActions.ShoppingListActions,
// ) {
//     console.log(action);
//     switch (action.type) {
//         case ShoppingListActions.ADD_INGREDIENT:
//             if (action instanceof ShoppingListActions.AddIngredient && action.payload) {
//                 return {
//                     ...state,
//                     ingredients: [...state.ingredients, action.payload],
//                 };
//             }
//             return state;
//         case ShoppingListActions.ADD_INGREDIENTS:
//             if (action instanceof ShoppingListActions.AddIngredients && action.payload) {
//                 return {
//                     ...state,
//                     ingredients: [...state.ingredients, ...action.payload],
//                 };
//             }
//             return state;
//         case ShoppingListActions.UPDATE_INGREDIENT:
//             if (
//                 action instanceof ShoppingListActions.UpdateIngredient &&
//                 action.payload &&
//                 state.editedIngredientIndex !== undefined
//             ) {
//                 const ingredient = state.ingredients[state.editedIngredientIndex];
//                 const updatedIngredient = {
//                     ...ingredient,
//                     ...action.payload,
//                 };
//                 const updatedIngredients = [...state.ingredients];
//                 updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
//                 console.log({
//                     ...state,
//                     ingredients: updatedIngredients,
//                     editedIngredientIndex: undefined,
//                     editedIngredient: undefined,
//                 });
//                 return {
//                     ...state,
//                     ingredients: updatedIngredients,
//                     editedIngredientIndex: undefined,
//                     editedIngredient: undefined,
//                 };
//             }
//             return state;
//         case ShoppingListActions.DELETE_INGREDIENT:
//             if (
//                 action instanceof ShoppingListActions.DeleteIngredient &&
//                 state.editedIngredientIndex !== undefined
//             ) {
//                 return {
//                     ...state,
//                     ingredients: state.ingredients.filter((ingredient, index) => {
//                         return index !== state.editedIngredientIndex;
//                     }),
//                     editedIngredientIndex: undefined,
//                     editedIngredient: undefined,
//                 };
//             }
//             return state;
//         case ShoppingListActions.START_EDIT:
//             if (action instanceof ShoppingListActions.StartEdit && action.payload !== undefined) {
//                 return {
//                     ...state,
//                     editedIngredientIndex: action.payload,
//                     editedIngredient: { ...state.ingredients[action.payload] },
//                 };
//             }
//             return state;
//         case ShoppingListActions.STOP_EDIT:
//             if (action instanceof ShoppingListActions.StopEdit) {
//                 return {
//                     ...state,
//                     editedIngredientIndex: undefined,
//                     editedIngredient: undefined,
//                 };
//             }
//             return state;
//         default:
//             return state;
//     }
// }
