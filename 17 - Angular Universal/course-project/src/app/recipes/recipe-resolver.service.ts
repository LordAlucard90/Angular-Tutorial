import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap, take } from 'rxjs';
// import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
// import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import * as fromRecipe from '../recipes/store/recipe.reducer';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(
        // private dataStorageService: DataStorageService,
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.store.select(fromRecipe.selectRecipesRecipes).pipe(
            take(1),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(RecipeActions.fetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipeActions.setRecipes),
                        take(1),
                        map(action => action.recipes),
                    );
                }
                return of(recipes);
            }),
        );
        // const recipes = this.recipeService.getRecipes();
        //
        // if (recipes.length === 0) {
        //     return this.dataStorageService.fetchRecipes();
        // } else {
        //     return recipes;
        // }
    }
}
