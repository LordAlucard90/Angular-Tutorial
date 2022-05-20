import {EventEmitter} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';

export class ShoppingListService {
    private ingredients: Ingredient[] = [new Ingredient('First', 3), new Ingredient('Second', 5)];

    public ingredientsChanged = new EventEmitter<Ingredient[]>();

    getIngredients(): Ingredient[] {
        return this.ingredients.slice(); // returns a copy
    }

    addIngredient(ingredient: Ingredient): void {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]): void {
        this.ingredients.push(...ingredients); // spread operator
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}
