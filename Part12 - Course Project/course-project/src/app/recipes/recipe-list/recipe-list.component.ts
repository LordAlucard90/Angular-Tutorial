import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
    @Output() recipeWasSelected = new EventEmitter<Recipe>();
    recipes: Recipe[] = [
        new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280'),
        new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380'),
    ];

    constructor() {}

    ngOnInit(): void {}

    onRecipeSelected(recipe: Recipe) {
        this.recipeWasSelected.emit(recipe);
    }
}
