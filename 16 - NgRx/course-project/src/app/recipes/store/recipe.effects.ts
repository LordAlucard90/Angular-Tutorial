import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromRecipe from './recipe.reducer';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
    private baseUrl = `${environment.serverUrl}/recipes`;
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>,
    ) {}

    fetchRecipes = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipeActions.fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>(`${this.baseUrl}`);
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : [],
                    };
                });
            }),
            map(recipes => {
                return RecipeActions.setRecipes({ recipes });
            }),
        ),
    );

    storeRecipes = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RecipeActions.storeRecipes),
                withLatestFrom(this.store.select(fromRecipe.selectRecipesRecipes)),
                tap(([_, recipes]) => {
                    for (let i = 0; i < recipes.length; i++) {
                        const curRecipe = recipes[i];
                        if (curRecipe.id) {
                            this.http
                                .put<Recipe>(`${this.baseUrl}/${curRecipe.id}`, curRecipe)
                                .subscribe(recipe => {
                                    console.log(recipe);
                                    this.store.dispatch(
                                        RecipeActions.updateRecipe({ index: i, recipe: recipe }),
                                    );
                                });
                        } else {
                            this.http
                                .post<Recipe>(`${this.baseUrl}`, curRecipe)
                                .subscribe(recipe => {
                                    console.log(recipe);
                                    this.store.dispatch(
                                        RecipeActions.updateRecipe({ index: i, recipe: recipe }),
                                    );
                                });
                        }
                    }
                }),
            ),
        { dispatch: false },
    );
}
