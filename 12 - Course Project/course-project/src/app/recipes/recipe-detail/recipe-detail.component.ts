import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
    // @Input() recipe: Recipe = {} as Recipe;
    recipe: Recipe = {} as Recipe;
    id: number = 0;

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        // does not reacts to changes
        // const id = this.route.snapshot.params['id'];
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.recipe = this.recipeService.getRecipe(this.id);
        });
        // since it is an angular observer the unsuscribe can be omitter
    }

    onEditRecipe() {
        // this.router.navigate(['edit'], { relativeTo: this.route });
        this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
    }

    onAddToShoppingList() {
        this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
    }

    onDeleteRecipe() {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['/recipes'])
    }
}
