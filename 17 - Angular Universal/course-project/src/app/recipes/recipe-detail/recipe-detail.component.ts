import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
// import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../../recipes/store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromRecipe from '../../recipes/store/recipe.reducer';
import { map, Observable, switchMap } from 'rxjs';

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
        // private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit(): void {
        // does not reacts to changes
        // const id = this.route.snapshot.params['id'];
        // this.route.params.subscribe((params: Params) => {
        //     this.id = +params['id'];
        //     this.recipe = this.recipeService.getRecipe(this.id);
        // });
        this.route.params
            .pipe(
                map(params => {
                    return +params['id'];
                }),
                switchMap((id: number) => {
                    this.id = id;
                    return this.store.select(fromRecipe.selectRecipesRecipesRecipe, {
                        index: id,
                    });
                }),
            )
            .subscribe(recipe => {
                if (recipe) {
                    this.recipe = recipe;
                }
            });
        // since it is an angular observer the unsuscribe can be omitter
    }

    onEditRecipe() {
        // this.router.navigate(['edit'], { relativeTo: this.route });
        this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
    }

    onAddToShoppingList() {
        // this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
        this.store.dispatch(
            ShoppingListActions.addIngredients({ ingredients: this.recipe.ingredients }),
        );
    }

    onDeleteRecipe() {
        // this.recipeService.deleteRecipe(this.id);
        this.store.dispatch(RecipesActions.deleteRecipe({ index: this.id }));
        this.router.navigate(['/recipes']);
    }
}
