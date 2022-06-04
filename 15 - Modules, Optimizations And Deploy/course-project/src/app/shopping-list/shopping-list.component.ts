import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
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

    constructor(
        private shoppingListService: ShoppingListService,
        private loggingService: LoggingService,
    ) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
        this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
            (ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
            },
        );
        this.loggingService.printLog('Hello from ShoppingListComponent.');
    }

    onEditItem(index: number) {
        this.shoppingListService.startedEditing.next(index);
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
