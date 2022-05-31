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
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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
    private startedEditingSubscription: Subscription;
    public editMode: boolean = false;
    private editedItemIndex: number | undefined;
    private editedItem: Ingredient | undefined;

    constructor(private shoppingListService: ShoppingListService) {
        this.startedEditingSubscription = shoppingListService.startedEditing.subscribe(
            (index: number) => {
                this.editedItemIndex = index;
                this.editedItem = shoppingListService.getIngredient(index);
                this.editMode = true;
                if (this.shoppingListForm) {
                    this.shoppingListForm.setValue({
                        name: this.editedItem.name,
                        amount: this.editedItem.amount,
                    });
                }
            },
        );
    }

    ngOnInit(): void { }

    onSubmit(form: NgForm) {
        // const name = this.nameInputReference.nativeElement.value;
        // const amount = this.amountInputReference.nativeElement.value;
        const { name, amount } = form.value;
        const ingredient = new Ingredient(name, amount);
        if (this.editMode && this.editedItemIndex !== undefined) {
            this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
        } else {
            this.shoppingListService.addIngredient(ingredient);
        }
        this.editMode = false;
        form.reset();
        // this.shoppingListService.addIngredient(ingredient);
        // this.ingredientAdded.emit(ingredient);
    }

    onClear() {
        this.shoppingListForm?.reset();
        this.editMode = false;
    }

    onDelete() {
        if (this.editedItemIndex !== undefined) {
            this.shoppingListService.deleteIngredient(this.editedItemIndex);
        }
        this.onClear();
    }

    ngOnDestroy(): void {
        this.startedEditingSubscription.unsubscribe();
    }
}
