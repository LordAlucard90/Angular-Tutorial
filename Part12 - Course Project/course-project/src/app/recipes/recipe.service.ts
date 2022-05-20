import {EventEmitter, Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Recipe} from './recipe.model';

@Injectable() // allow to inject other services in in
export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280', [
            new Ingredient('Ingredient A', 1),
            new Ingredient('Ingredient B', 2),
        ]),
        new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380', [
            new Ingredient('Ingredient A', 3),
            new Ingredient('Ingredient C', 4),
        ]),
    ];

    recipeSelected = new EventEmitter<Recipe>();

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes(): Recipe[] {
        return this.recipes.slice(); // returns a copy
    }

    addIngredientToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }
}
