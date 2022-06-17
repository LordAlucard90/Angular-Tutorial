import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
// import { Subscription } from 'rxjs';
// import { Recipe } from '../recipe.model';
// import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipe from '../../recipes/store/recipe.reducer';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
    // @Output() recipeWasSelected = new EventEmitter<Recipe>();
    // recipes: Recipe[] = [];
    recipes$ = this.store.select(fromRecipe.selectRecipesRecipes);
    // recipeChangedSubscription: Subscription;
    // recipes: Recipe[] = [
    //     new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280'),
    //     new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380'),
    // ];

    constructor(
        // private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {
        // this.recipeChangedSubscription = this.recipeService.recipeChanged.subscribe(
        //     (recipes: Recipe[]) => {
        //         this.recipes = recipes;
        //     },
        // );
    }

    ngOnInit(): void {
        // still needed for first load
        // this.recipes = this.recipeService.getRecipes();
    }

    onNewRecipe() {
        this.router.navigate(['new'], { relativeTo: this.route });
    }

    // onRecipeSelected(recipe: Recipe) {
    //     this.recipeWasSelected.emit(recipe);
    // }

    ngOnDestroy(): void {
        // this.recipeChangedSubscription.unsubscribe();
    }
}
