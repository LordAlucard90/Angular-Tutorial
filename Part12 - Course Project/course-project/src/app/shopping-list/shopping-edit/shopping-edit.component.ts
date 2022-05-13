import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Ingredient} from 'src/app/shared/ingredient.model';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
    @ViewChild('nameInput') nameInputReference: ElementRef = {} as ElementRef;
    @ViewChild('amountInput') amountInputReference: ElementRef = {} as ElementRef;
    @Output() ingredientAdded = new EventEmitter<Ingredient>();

    constructor() {}

    ngOnInit(): void {}

    onAddItem() {
        const name = this.nameInputReference.nativeElement.value;
        const amount = this.amountInputReference.nativeElement.value;
        const ingredient = new Ingredient(name, amount);
        this.ingredientAdded.emit(ingredient);
    }
}
