import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[] = [];
    // ingredients: Ingredient[] = [new Ingredient('First', 3), new Ingredient('Second', 5)];
    private shoppingListSubscription: Subscription | undefined;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
        this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
            (ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
            },
        );
    }

    // onIngredientAdded(ingredient: Ingredient) {
    //     this.ingredients.push(ingredient);
    // }
    //
    ngOnDestroy(): void {
        if (this.shoppingListSubscription) {
            this.shoppingListSubscription.unsubscribe();
        }
    }
}
