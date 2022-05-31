import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    private baseUrl = 'http://localhost:3000/recipes';
    constructor(private http: HttpClient, private recipeService: RecipeService) { }

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
    }
}
