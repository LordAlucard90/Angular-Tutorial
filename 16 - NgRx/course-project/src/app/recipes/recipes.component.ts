import {Component, OnInit} from '@angular/core';
// import {Recipe} from './recipe.model';
// import {RecipeService} from './recipe.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css'],
    // providers: [RecipeService],
})
export class RecipesComponent implements OnInit {
    // selectedRecipe: Recipe | undefined;

    // constructor(private recipeService: RecipeService) {}
    constructor() {}

    ngOnInit(): void {
        // this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
        //     this.selectedRecipe = recipe;
        // });
    }
}
