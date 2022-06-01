import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable() // allow to inject other services in in
export class RecipeService {
    // private recipes: Recipe[] = [
    // new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280', [
    //     new Ingredient('Ingredient A', 1),
    //     new Ingredient('Ingredient B', 2),
    // ]),
    // new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380', [
    //     new Ingredient('Ingredient A', 3),
    //     new Ingredient('Ingredient C', 4),
    // ]),
    // ];
    private recipes: Recipe[] = [];

    // recipeSelected = new EventEmitter<Recipe>();
    recipeChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice(); // returns a copy
    }

    getRecipe(index: number): Recipe {
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}
