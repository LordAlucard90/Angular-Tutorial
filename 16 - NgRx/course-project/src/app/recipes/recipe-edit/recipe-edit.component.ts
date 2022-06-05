import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
// import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipe from '../../recipes/store/recipe.reducer';
import * as RecipesActions from '../../recipes/store/recipe.actions';
import { map, Subscription } from 'rxjs';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    id: number | undefined;
    editMode: boolean = false;
    recipeForm: FormGroup;
    store$: Subscription | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
    ) {
        this.recipeForm = this.initForm();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.editMode = params['id'] != null;
            if (this.editMode) {
                this.id = +params['id'];
                // reinitialize the form
                this.recipeForm = this.initForm();
            }
        });
        // since it is an angular observer the unsuscribe can be omitted
    }

    private initForm(): FormGroup {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        if (this.editMode && this.id !== undefined) {
            console.log('id', this.id);
            this.store$ = this.store
                .select(fromRecipe.selectRecipesRecipesRecipe, { index: this.id })
                .subscribe(recipe => {
                    console.log('recipe', recipe);
                    if (recipe) {
                        recipeName = recipe.name;
                        recipeImagePath = recipe.imagePath;
                        recipeDescription = recipe.description;
                        if (recipe.ingredients) {
                            for (let ingredient of recipe.ingredients) {
                                recipeIngredients.push(
                                    new FormGroup({
                                        name: new FormControl(ingredient.name, Validators.required),
                                        amount: new FormControl(ingredient.amount, [
                                            Validators.required,
                                            Validators.pattern(/^[1-9]+[0-9]*$/),
                                        ]),
                                    }),
                                );
                            }
                        }
                    }
                });
            // const recipe = this.recipeService.getRecipe(this.id);
            // recipeName = recipe.name;
            // recipeImagePath = recipe.imagePath;
            // recipeDescription = recipe.description;
            // if (recipe.ingredients) {
            //     for (let ingredient of recipe.ingredients) {
            //         recipeIngredients.push(
            //             new FormGroup({
            //                 name: new FormControl(ingredient.name, Validators.required),
            //                 amount: new FormControl(ingredient.amount, [
            //                     Validators.required,
            //                     Validators.pattern(/^[1-9]+[0-9]*$/),
            //                 ]),
            //             }),
            //         );
            //     }
            // }
        }

        return new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imagePath: new FormControl(recipeImagePath, Validators.required),
            description: new FormControl(recipeDescription, Validators.required),
            ingredients: recipeIngredients,
        });
    }

    get controls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl(null, Validators.required),
                amount: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
            }),
        );
    }

    onDeleteIngredient(index: number) {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    }

    onCancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    onSubmit() {
        // const recipe = new Recipe(
        //     this.recipeForm.value['name'],
        //     this.recipeForm.value['description'],
        //     this.recipeForm.value['imagePath'],
        //     this.recipeForm.value['ingredients'],
        // );
        // or since the format is the same
        const recipe = this.recipeForm.value;

        if (this.editMode && this.id !== undefined) {
            // this.recipeService.updateRecipe(this.id, recipe);
            this.store.dispatch(RecipesActions.updateRecipe({ index: this.id, recipe: recipe }));
        } else {
            // this.recipeService.addRecipe(recipe);
            this.store.dispatch(RecipesActions.addRecipe({ recipe }));
        }
        this.onCancel();
        // console.log(this.recipeForm);
    }

    ngOnDestroy(): void {
        if (this.store$) {
            this.store$.unsubscribe();
        }
    }
}
