import { createReducer, createSelector, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
    recipes: Recipe[];
}

export interface AppState {
    recipes: State;
}

export const selectRecipes = (state: AppState) => state.recipes;

export const selectRecipesRecipes = createSelector(selectRecipes, (state: State) => state.recipes);

export const selectRecipesRecipesRecipe = createSelector(
    selectRecipes,
    (state: State, props: { index: number }) => {
        return state.recipes.find((recipe, index) => {
            return props.index === index;
        });
    },
);

const initialState: State = {
    recipes: [],
};

export const authReducer = createReducer(
    initialState,
    on(RecipeActions.setRecipes, (state, { recipes }) => {
        return {
            ...state,
            recipes: [...recipes],
        };
    }),
    on(RecipeActions.addRecipe, (state, { recipe }) => {
        return {
            ...state,
            recipes: [...state.recipes, recipe],
        };
    }),
    on(RecipeActions.updateRecipe, (state, { index, recipe }) => {
        const updatedRecipe = { ...state.recipes[index], ...recipe };
        const updatedRecipes = [...state.recipes];
        updatedRecipes[index] = updatedRecipe;
        return {
            ...state,
            recipes: updatedRecipes,
        };
    }),
    on(RecipeActions.deleteRecipe, (state, { index }) => {
        return {
            ...state,
            recipes: state.recipes.filter((_, idx) => {
                return index !== idx;
            }),
        };
    }),
);
