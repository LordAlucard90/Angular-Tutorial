import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromApp from '../store/app.reducer';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ingredients: Ingredient[] = [];
    // ingredients: Observable<fromShoppingList.State>;
    ingredients: Observable<Ingredient[]>;
    // ingredients: Ingredient[] = [new Ingredient('First', 3), new Ingredient('Second', 5)];
    // private shoppingListSubscription: Subscription | undefined;

    constructor(
        // private shoppingListService: ShoppingListService,
        private loggingService: LoggingService,
        // private store: Store<fromShoppingList.AppState>,
        private store: Store<fromApp.AppState>,
    ) {
        // this.ingredients = this.store.select('shoppingList');
        this.ingredients = this.store.select(fromShoppingList.selectShoppingListIngredients);
    }

    ngOnInit(): void {
        // this.ingredients = this.shoppingListService.getIngredients();
        // this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
        //     (ingredients: Ingredient[]) => {
        //         this.ingredients = ingredients;
        //     },
        // );
        this.loggingService.printLog('Hello from ShoppingListComponent.');
    }

    onEditItem(index: number) {
        // this.shoppingListService.startedEditing.next(index);
        // this.store.dispatch(new ShoppingListActions.StartEdit(index));
        this.store.dispatch(ShoppingListActions.startEdit({index}));
    }

    // onIngredientAdded(ingredient: Ingredient) {
    //     this.ingredients.push(ingredient);
    // }
    //
    ngOnDestroy(): void {
        // if (this.shoppingListSubscription) {
        //     this.shoppingListSubscription.unsubscribe();
        // }
    }
}
