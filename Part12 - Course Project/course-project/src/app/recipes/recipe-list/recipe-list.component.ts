import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
    // @Output() recipeWasSelected = new EventEmitter<Recipe>();
    recipes: Recipe[] = [];
    // recipes: Recipe[] = [
    //     new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280'),
    //     new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380'),
    // ];

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.recipes = this.recipeService.getRecipes();
    }

    onNewRecipe() {
        this.router.navigate(['new'], { relativeTo: this.route });
    }

    // onRecipeSelected(recipe: Recipe) {
    //     this.recipeWasSelected.emit(recipe);
    // }
}
