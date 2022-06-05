import {
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as fromApp from '../../store/app.reducer';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // @ViewChild('nameInput') nameInputReference: ElementRef = {} as ElementRef;
    // @ViewChild('amountInput') amountInputReference: ElementRef = {} as ElementRef;
    // @Output() ingredientAdded = new EventEmitter<Ingredient>();
    @ViewChild('f') shoppingListForm: NgForm | undefined;
    // private startedEditingSubscription: Subscription;
    private shoppingListSubscription: Subscription;
    public editMode: boolean = false;
    // private editedItemIndex: number | undefined;
    // private editedItem: Ingredient | undefined;

    constructor(
        // private shoppingListService: ShoppingListService,
        // private store: Store<fromShoppingList.AppState>,
        private store: Store<fromApp.AppState>,
    ) {
        // this.shoppingListSubscription = this.store.select('shoppingList').subscribe(stateData => {
        this.shoppingListSubscription = this.store.select(fromShoppingList.selectShoppingList).subscribe(stateData => {
            if (stateData.editedIngredientIndex !== undefined && stateData.editedIngredient) {
                this.editMode = true;
                if (this.shoppingListForm) {
                    this.shoppingListForm.setValue({
                        name: stateData.editedIngredient.name,
                        amount: stateData.editedIngredient.amount,
                    });
                }
            } else {
                this.editMode = false;
            }
        });
        // this.startedEditingSubscription = shoppingListService.startedEditing.subscribe(
        //     (index: number) => {
        //         this.editedItemIndex = index;
        //         this.editedItem = shoppingListService.getIngredient(index);
        //         this.editMode = true;
        //         if (this.shoppingListForm) {
        //             this.shoppingListForm.setValue({
        //                 name: this.editedItem.name,
        //                 amount: this.editedItem.amount,
        //             });
        //         }
        //     },
        // );
    }

    ngOnInit(): void { }

    onSubmit(form: NgForm) {
        // const name = this.nameInputReference.nativeElement.value;
        // const amount = this.amountInputReference.nativeElement.value;
        const { name, amount } = form.value;
        const ingredient = new Ingredient(name, amount);
        // if (this.editMode && this.editedItemIndex !== undefined) {
        if (this.editMode) {
            // this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
            // this.store.dispatch(
            // new ShoppingListActions.UpdateIngredient({
            //     index: this.editedItemIndex,
            //     ingredient: ingredient,
            // }),
            // );
            // this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
            this.store.dispatch(ShoppingListActions.updateIngredient({ingredient}));
        } else {
            // this.shoppingListService.addIngredient(ingredient);
            // this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
            this.store.dispatch(ShoppingListActions.addIngredient({ingredient}));
        }
        this.editMode = false;
        form.reset();
        // this.shoppingListService.addIngredient(ingredient);
        // this.ingredientAdded.emit(ingredient);
    }

    onClear() {
        this.shoppingListForm?.reset();
        this.editMode = false;
        // this.store.dispatch(new ShoppingListActions.StopEdit());
        this.store.dispatch(ShoppingListActions.stopEdit());
    }

    onDelete() {
        // if (this.editedItemIndex !== undefined) {
        // this.shoppingListService.deleteIngredient(this.editedItemIndex);
        // this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
        // }
        // this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.store.dispatch(ShoppingListActions.deleteIngredient());
        this.onClear();
    }

    ngOnDestroy(): void {
        // this.startedEditingSubscription.unsubscribe();
        this.shoppingListSubscription.unsubscribe();
        // this.store.dispatch(new ShoppingListActions.StopEdit());
        this.store.dispatch(ShoppingListActions.stopEdit());
    }
}
