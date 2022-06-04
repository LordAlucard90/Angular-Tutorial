import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth-service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    private baseUrl = `${environment.serverUrl}/recipes`;
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService,
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        for (let i = 0; i < recipes.length; i++) {
            const curRecipe = recipes[i];
            if (curRecipe.id) {
                this.http
                    .put<Recipe>(`${this.baseUrl}/${curRecipe.id}`, curRecipe)
                    .subscribe(recipe => {
                        console.log(recipe);
                        this.recipeService.updateRecipe(i, recipe);
                    });
            } else {
                this.http.post<Recipe>(`${this.baseUrl}`, curRecipe).subscribe(recipe => {
                    console.log(recipe);
                    this.recipeService.updateRecipe(i, recipe);
                });
            }
        }
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(`${this.baseUrl}`).pipe(
            // keep previously behaviour in the pipe
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : [],
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            }),
        );
        // return this.authService.user.pipe(
        //     // automatically unsubscribe after 1 use
        //     take(1),
        //     // changes the observable in a new type
        //     exhaustMap(user => {
        //         return this.http.get<Recipe[]>(`${this.baseUrl}`, {
        //             headers: new HttpHeaders().set('Authorization', `Bearer ${user?.token}`),
        //         });
        //     }),
        //     // keep previously behaviour in the pipe
        //     map(recipes => {
        //         return recipes.map(recipe => {
        //             return {
        //                 ...recipe,
        //                 ingredients: recipe.ingredients ? recipe.ingredients : [],
        //             };
        //         });
        //     }),
        //     tap(recipes => {
        //         this.recipeService.setRecipes(recipes);
        //     }),
        // );
    }
}
