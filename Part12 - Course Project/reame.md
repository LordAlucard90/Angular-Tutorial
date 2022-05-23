# Course Project

- [The Basics](#the-basics)
- [Components And Data Binding Deep Dive](#components-and-databinding-deep-dive)
- [Directives Deep Dive](#directives-deep-dive)
- [Services And Dependency Injection](#services-and-dependency-injection)
- [Routing](#routing)
- [Observables](#observables)
- [Forms](#forms)

---

## The Basics

The project can be created with
```bash
ng new course-project
```

### Bootstrap

Even if at the moment the recenter Bootstrap version it the 5, 
the 3 will be used as in the curse to avoid annoying incompatibilities.

```bash
npm i --save bootstrap@3
```
and add it to the **angular.json**:
```json
"projects": {
  "course-project": {
    ...
    "architect": {
      "build": {
        ...
        "options": {
          ...
          "styles": [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "src/styles.css"
          ],
```

### Component Creation

```bash
ng generate component <component>
// or 
ng g c <component>
// to ignore test files
ng g c <component> --skipTest true
// to create the component in a sub path
ng g c <base_path>/<component>
```

### Project Structure

The components are placed inside the other coponents that will primary use them,
the shared folder is created for the once that will be used across multiples.
```
src
├── app
│   ├── app.component.css
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── header
│   │   ├── header.component.css
│   │   ├── header.component.html
│   │   └── header.component.ts
│   ├── recipes
│   │   ├── recipe-detail
│   │   │   ├── recipe-detail.component.css
│   │   │   ├── recipe-detail.component.html
│   │   │   └── recipe-detail.component.ts
│   │   ├── recipe-list
│   │   │   ├── recipe-item
│   │   │   │   ├── recipe-item.component.css
│   │   │   │   ├── recipe-item.component.html
│   │   │   │   └── recipe-item.component.ts
│   │   │   ├── recipe-list.component.css
│   │   │   ├── recipe-list.component.html
│   │   │   └── recipe-list.component.ts
│   │   ├── recipe.model.ts
│   │   ├── recipes.component.css
│   │   ├── recipes.component.html
│   │   └── recipes.component.ts
│   ├── shared
│   │   └── ingredient.model.ts
│   └── shopping-list
│       ├── shopping-edit
│       │   ├── shopping-edit.component.css
│       │   ├── shopping-edit.component.html
│       │   └── shopping-edit.component.ts
│       ├── shopping-list.component.css
│       ├── shopping-list.component.html
│       └── shopping-list.component.ts
├── assets
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.css
└── test.ts
```

### Model Definition And Usage

Definition:
```typescript
export class Recipe {
  constructor(
    public name: string,
    public description: string,
    public imagePath: string
  ) {}
}
```

Usage:
```typescript
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
      new Recipe("A Test Recipe", "Just a test", "https://placedog.net/500/280")
  ];

  constructor() {}

  ngOnInit(): void {}
}
```
```html
<a href="#" class="list-group-item clearfix" *ngFor="let recipe of recipes">
  <div class="pull-left">
    <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
    <p class="list-group-item-text">{{ recipe.description }}</p>
  </div>
  <span class="pull-right">
    <img
      [src]="recipe.imagePath"
      alt="{{ recipe.name }}"
      class="img-responsive"
      style="max-height: 50px"
    />
  </span>
</a>
```

## Components And Data Binding Deep Dive

### ngIf

A first simple navigation form the `HeaderComponent`, can be accomplished
emitting a value corresponding to the wanted page:
```angular2html
<!-- ... -->
<li><a href="#" (click)="onSelect('recipe')">Recipes</a></li>
<li><a href="#" (click)="onSelect('shopping-list')">Shopping List</a></li>
<!-- ... -->
```

```typescript
export class HeaderComponent implements OnInit {
    @Output() featureSelected = new EventEmitter<string>();
    
    // ...

    onSelect(feature: string) {
        this.featureSelected.emit(feature);
    }
}
```

And using an `ngIf` statement to display the selected page in the `AppComponent`:
```angular2html
<app-header (featureSelected)="onNavigate($event)"></app-header>
<div class="container">
  <div class="row">
    <div class="col-md-12">
        <app-recipes *ngIf="loadedFeature === 'recipe'"></app-recipes>
        <app-shopping-list *ngIf="loadedFeature === 'shopping-list'"></app-shopping-list>
    </div>
  </div>
</div>
```

```typescript
export class AppComponent {
    loadedFeature = 'recipe';
    title = 'course-project';

    onNavigate(feature: string) {
        this.loadedFeature= feature
    }
}
```

### ngFor

It is possible to pass the content of each recipe form the `RecipeListComponent`
to the 'RecipeItem' looping over the elements and passing the current value:
```angular2html
<!-- ... -->
<app-recipe-item *ngFor="let curRecipe of recipes" [recipe]="curRecipe"></app-recipe-item>
<!-- ... -->
```
In the `RecipeItemComponent` it then possible to catch this value
using `@Input` and displaying the data in the view:
```typescript
export class RecipeItemComponent implements OnInit {
    @Input() recipe: Recipe = {} as Recipe;

    constructor() {}

    ngOnInit(): void {}
}
```
```angular2html
<a 
    href="#"
    class="list-group-item clearfix"
    >
    <div class="pull-left">
        <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
        <p class="list-group-item-text">{{ recipe.description }}</p>
    </div>
    <span class="pull-right">
        <img [src]="recipe.imagePath" alt="{{ recipe.name }}" class="img-responsive" style="max-height: 50px" />
    </span>
</a>
```

### Passing Current Selected Recipe

Starting from the `RecipeItemComponent` can be emitted an avent on select:
```angular2html
<a 
    href="#"
    class="list-group-item clearfix"
    (click)="onSelected()"
    >
    <!-- ... -->
</a>
```
```typescript
export class RecipeItemComponent implements OnInit {
    // ...
    @Output() recipeSelected = new EventEmitter<void>();
    // ...
    onSelected() {
        this.recipeSelected.emit();
    }
}
```
intercepts and resent in the `RecipeListComponent`:
```angular2html
<!-- ... -->
<app-recipe-item
    *ngFor="let curRecipe of recipes"
    [recipe]="curRecipe"
    (recipeSelected)="onRecipeSelected(curRecipe)"
    ></app-recipe-item>
<!-- ... -->
```
```typescript
export class RecipeListComponent implements OnInit {
    @Output() recipeWasSelected = new EventEmitter<Recipe>();
    // ...
    onRecipeSelected(recipe: Recipe) {
        this.recipeWasSelected.emit(recipe);
    }
}
```
intercepts and resent in the `RecipesComponent`:
```angular2html
<div class="row">
    <div class="col-md-5">
        <app-recipe-list (recipeWasSelected)="selectedRecipe = $event"></app-recipe-list>
    </div>
    <div class="col-md-7">
        <app-recipe-detail
            *ngIf="selectedRecipe; else infoText"
            [recipe]="selectedRecipe"
            ></app-recipe-detail>
        <ng-template #infoText>
            <p>Please select a Recipe!</p>
        </ng-template>
    </div>
</div>
```
```typescript
export class RecipesComponent implements OnInit {
    selectedRecipe: Recipe | undefined;
    // ...
}
```
finally showed in the `RecipeDetailComponent`:
```typescript
export class RecipeDetailComponent implements OnInit {
    @Input() recipe: Recipe = {} as Recipe;
    // ...
}
```
```angular2html
<div class="row">
  <div class="col-xs-12">
    <img 
    [src]="recipe.imagePath"
    [alt]="recipe.name"
    class="img-responsive"
    style="max-height: 300px"
    />
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
      <h1>{{recipe.name}}</h1>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
    <div class="btn-group">
      <button type="button" class="btn btn-primary dropdown-toggle">
        Manage <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#">Add To Shopping List</a></li>
        <li><a href="#">Edit Recipe</a></li>
        <li><a href="#">Delete Recipe</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
      {{recipe.description}}
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
    Ingredients
  </div>
</div>
```

### ViewChild

It is possile to read the content of an input from `ShoppingEditComponent`:
```angular2html
<!-- ... -->
<div class="col-sm-5 form-group">
    <label for="name">Name</label>
    <input 
    type="text"
    id="name"
    class="form-control"
    #nameInput
    />
</div>
<div class="col-sm-2 form-group">
    <label for="amount">Amount</label>
    <input 
    type="number"
    id="amount"
    class="form-control"
    #amountInput
    />
</div>
<!-- ... -->
```
```typescript
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
```
and send it to the `ShoppingListComponent`:
```typescript
export class ShoppingListComponent implements OnInit {
    ingredients: Ingredient[] = [/* ... */];
    // ...
    onIngredientAdded(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
    }
}
```

## Directives Deep Dive

It is possile to create a directive using:
```bash
ng generate directive directive-name 
# or 
ng g d directive-name 
```
In order to create a directive to open and closa the dropdowns the
typescript code is:
```typescript
export class DropdownDirective {
    // property on the DOM element
    @HostBinding('class.open') isOpen: boolean = false;

    // element on witch the directive is placed
    constructor(private elRef: ElementRef) {
         console.log(elRef)
    }

    // click listener on the page
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    // click listener on the elemene, (doesn't close if clicked on other place)
    // @HostListener('click') toggle() {
    //     this.isOpen = !this.isOpen;
    // }
}
```
In the html is id enough to use:
```angular2html
<!-- recipe-detail -->
    <div class="btn-group" appDropdown>
<!-- header -->
    <li class="dropdown" appDropdown>
```

## Services And Dependency Injection

### RecipeService

The service:
```typescript
export class RecipeService {
    // data
    private recipes: Recipe[] = [
        new Recipe('Firs Recipe', 'Just first test', 'https://placedog.net/500/280'),
        new Recipe('Second Recipe', 'Just second test', 'https://placedog.net/600/380'),
    ];

    // new hook to pass the data through components
    recipeSelected = new EventEmitter<Recipe>();

    getRecipes(): Recipe[] {
        return this.recipes.slice(); // returns a copy
    }
}
```
The top provider (automatically injected to children):
```typescript
@Component({
    // ...
    providers: [RecipeService]
})
export class RecipesComponent implements OnInit {
    selectedRecipe: Recipe | undefined;

    constructor(private recipeService: RecipeService) {}

    ngOnInit(): void {
        // new subscriber here
        this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
            this.selectedRecipe = recipe;
        });
    }
}
```
Loading recipes:
```typescript
@Component({
    // ..
})
export class RecipeListComponent implements OnInit {
    recipes: Recipe[] = [];

    constructor(private recipeService: RecipeService) {}

    ngOnInit(): void {
        this.recipes = this.recipeService.getRecipes();
    }
    // all other not needed anymore
}
```
Emit selected recipe event:
```typescript
@Component({
    // ...
})
export class RecipeItemComponent implements OnInit {
    // ...

    constructor(private recipeService: RecipeService) {}

    // ...

    onSelected() {
        // new emitter mechanisms
        this.recipeService.recipeSelected.emit(this.recipe);
    }
}
```
and remove html emit:
```angular2html
<!-- recipe-list.component.html -->
<div class="row">
    <div class="col-xs-12">
        <button class="btn btn-success">New Recipe</button>
    </div>
</div>
<hr />
<div class="row">
    <div class="col-xs-12">
        <app-recipe-item
            *ngFor="let curRecipe of recipes"
            [recipe]="curRecipe"
            <!-- (recipeSelected)="onRecipeSelected(curRecipe)" -->
            ></app-recipe-item>
    </div>
</div>
```
```angular2html
<!-- recipes.component.html -->
<div class="row">
    <div class="col-md-5">
        <app-recipe-list
            <!-- (recipeWasSelected)="selectedRecipe = $event" -->
            ></app-recipe-list>
    </div>
    <div class="col-md-7">
        <app-recipe-detail
            *ngIf="selectedRecipe; else infoText"
            [recipe]="selectedRecipe"
            ></app-recipe-detail>
        <ng-template #infoText>
            <p>Please select a Recipe!</p>
        </ng-template>
    </div>
</div>
```

### ShoppingListService

The new service:
```typescript
export class ShoppingListService {
    private ingredients: Ingredient[] = [new Ingredient('First', 3), new Ingredient('Second', 5)];

    public ingredientsChanged = new EventEmitter<Ingredient[]>();

    getIngredients(): Ingredient[] {
        return this.ingredients.slice(); // returns a copy
    }

    addIngredient(ingredient: Ingredient): void {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}
```
it is provided globally because it will be used also in other parts 
of the application:
```typescript
@NgModule({
    // ...
    providers: [ShoppingListService],
    // ...
})
export class AppModule {}
```
showing the ingredients:
```typescript
@Component({
    // ...
})
export class ShoppingListComponent implements OnInit {
    ingredients: Ingredient[] = [];

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
        this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
        });
    }
}
```
adding an ingredient:
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit {
    @ViewChild('nameInput') nameInputReference: ElementRef = {} as ElementRef;
    @ViewChild('amountInput') amountInputReference: ElementRef = {} as ElementRef;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {}

    onAddItem() {
        const name = this.nameInputReference.nativeElement.value;
        const amount = this.amountInputReference.nativeElement.value;
        const ingredient = new Ingredient(name, amount);
        this.shoppingListService.addIngredient(ingredient);
    }
}
```
clean the html from the not used event listener:
```angular2html
<!-- shopping-list.component.html -->
<div class="row">
  <div class="col-xs-12">
    <app-shopping-edit
        <!-- (ingredientAdded)="onIngredientAdded($event)" -->
        ></app-shopping-edit>
    <hr />
    <ul class="list-group">
      <a 
          href="#"
          class="list-group-item" style="cursor: pointer"
          *ngFor="let ingredient of ingredients"
          >
          {{ingredient.name}} ({{ingredient.amount}})
      </a>
    </ul>
  </div>
</div>
```

### Add Ingredients To Recipe

New Recipe Structure:
```typescript
export class Recipe {
    constructor(
        public name: string,
        public description: string,
        public imagePath: string,
        public ingredients: Ingredient[],
    ) {}
}
```
show ingredients under current recipe and trigger the sent:
```typescript
<!-- recipe-detail.component.html -->
<!-- ... -->
<div class="row">
  <div class="col-xs-12">
    <div class="btn-group" appDropdown>
      <button type="button" class="btn btn-primary dropdown-toggle">
        Manage <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a 
                (click)="onAddToShoppingList()"
                style="cursor: pointer"
                >Add To Shopping List</a></li>
        <li><a href="#">Edit Recipe</a></li>
        <li><a href="#">Delete Recipe</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
      {{recipe.description}}
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
      <ul class="list-group">
          <li 
              class="list-group-item"
              *ngFor="let ingredient of recipe.ingredients"
              >
              {{ingredient.name}} ({{ingredient.amount}})
          </li>
      </ul>
  </div>
</div>
```
component usagge:
```typescript
@Component({
    // ...
})
export class RecipeDetailComponent implements OnInit {
    // ...

    constructor(private recipeService: RecipeService) {}

    // ...

    onAddToShoppingList() {
        this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
    }
}
```
Services changes:
```typescript
@Injectable() // allow to inject other services in in
export class RecipeService {
    // ...
    constructor(private shoppingListService: ShoppingListService){ }

    // ...

    addIngredientToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }
}
```
```typescript
export class ShoppingListService {
    // ...

    addIngredients(ingredients: Ingredient[]): void {
        this.ingredients.push(...ingredients); // spread operator
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}
```

## Routing

The basic routing setup is done by creating a routing module:
```typescript
const routes: Routes = [
    { 
        path: '', // use only path: '' gives and error because it is always math
        redirectTo: '/recipes',
        pathMatch: 'full' // this restricts the match to strict equal only
    },
    { path: 'recipes', component: RecipesComponent },
    { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```
adding it to the main app module:
```typescript
@NgModule({
    declarations: [/* ... */],
    imports: [/* ... */, AppRoutingModule],
    // ...
})
export class AppModule {}
```
and setting the routing mechanism:
```angular2html
<!-- app.component.html -->
<app-header></app-header>
<!-- <app-header (featureSelected)="onNavigate($event)"></app-header> -->
<div class="container">
  <div class="row">
    <div class="col-md-12">
        <router-outlet></router-outlet>
        <!-- <app-recipes *ngIf="loadedFeature === 'recipe'"></app-recipes> -->
        <!-- <app-shopping-list *ngIf="loadedFeature === 'shopping-list'"></app-shopping-list> -->
    </div>
  </div>
</div>
```
```typescript
@Component({
    // ...
})
export class AppComponent {
    // loadedFeature = 'recipe';
    title = 'course-project';

    // onNavigate(feature: string) {
    //     this.loadedFeature = feature;
    // }
}
```
The actual navigation can be set in the header:
```typescript
<!-- app.component.html -->
<!-- ... -->
    <ul class="nav navbar-nav">
        <li routerLinkActive="active"><a routerLink="/recipes">Recipes</a></li>
        <li routerLinkActive="active"><a routerLink="/shopping-list">Shopping List</a></li>
        <!-- <li><a href="#" (click)="onSelect('recipe')">Recipes</a></li> -->
        <!-- <li><a href="#" (click)="onSelect('shopping-list')">Shopping List</a></li> -->
    </ul>
<!-- ... -->
```
in order to fix the page reloagind problems it is necessary to remove 
all the `href="#"` placed in the application.
Moreover can be added the `style="cursor: pointer;"`.

### Child Routing

Children routes can be simply added in the routing component:
```typescript
const routes: Routes = [
    // ...
    {
        path: 'recipes',
        component: RecipesComponent,
        children: [
            { path: '', component: RecipeStartComponent },
            { path: ':id', component: RecipeDetailComponent },
        ],
    },
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```
then must be added the routing mechanism in the parent component:
```angular2html
<!-- recipes.component.html -->
<div class="row">
    <div class="col-md-5">
        <app-recipe-list
            ></app-recipe-list>
            <!-- (recipeWasSelected)="selectedRecipe = $event" -->
            <!-- ></app-recipe-list> -->
    </div>
    <div class="col-md-7">
        <router-outlet></router-outlet>
        <!-- <app-recipe-detail -->
        <!--     *ngIf="selectedRecipe; else infoText" -->
        <!--     [recipe]="selectedRecipe" -->
        <!--     ></app-recipe-detail> -->
        <!-- <ng-template #infoText> -->
        <!--     <p>Please select a Recipe!</p> -->
        <!-- </ng-template> -->
    </div>
</div>
```
and retrieve the current element from the route
```typescript
@Component({
    // ...
})
export class RecipeDetailComponent implements OnInit {
    // @Input() recipe: Recipe = {} as Recipe;
    recipe: Recipe = {} as Recipe;
    id: number = 0;

    constructor(private recipeService: RecipeService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // does not reacts to changes
        // const id = this.route.snapshot.params['id'];
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.recipe = this.recipeService.getRecipe(this.id);
        });
        // since it is an angular observer the unsuscribe can be omitted
    }

    onAddToShoppingList() {
        this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
    }
}
```
update the service:
```typescript
@Injectable() // allow to inject other services in in
export class RecipeService {
    // ...
    getRecipe(index: number): Recipe {
        return this.recipes[index]
    }
    // ...
}
```
and the related views to read the current route:
```angular2html
<!-- recipe-list.component.html -->
<div class="row">
    <div class="col-xs-12">
        <button class="btn btn-success">New Recipe</button>
    </div>
</div>
<hr />
<div class="row">
    <div class="col-xs-12">
        <app-recipe-item
            *ngFor="let curRecipe of recipes; let i = index"
            [recipe]="curRecipe"
            [index]="i"
            ></app-recipe-item>
            <!-- (recipeSelected)="onRecipeSelected(curRecipe)" -->
            <!-- ></app-recipe-item> -->
    </div>
</div>
```
update the old mechanism in the recipe item:
```angular2html
<!-- recipe-item.component.html -->
<a 
    style="cursor: pointer;"
    [routerLink]="[index]"
    routerLinkActive="active"
    class="list-group-item clearfix"
    <!-- (click)="onSelected()" not needed -->
    >
    <div class="pull-left">
        <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
        <p class="list-group-item-text">{{ recipe.description }}</p>
    </div>
    <span class="pull-right">
        <img [src]="recipe.imagePath" alt="{{ recipe.name }}" class="img-responsive" style="max-height: 50px" />
    </span>
</a>
```
```typescript
@Component({
    // ...
})
export class RecipeItemComponent implements OnInit {
    /* @Input() */ recipe: Recipe = {} as Recipe;
    @Input() index: number = 0;

    constructor(/* private recipeService: RecipeService */) {}

    ngOnInit(): void {}

    // onSelected() { not needed anymoer
    //     this.recipeService.recipeSelected.emit(this.recipe);
    // }
}
```

### Edit A Recipe

New routes:
```typescript
const routes: Routes = [
    // ...
    {
        path: 'recipes',
        component: RecipesComponent,
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent },
            { path: ':id/edit', component: RecipeEditComponent },
        ],
    },
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```
getting the editing mode:
```typescript
@Component({
    // ...
})
export class RecipeEditComponent implements OnInit {
    id: number | undefined;
    editMode: boolean = false;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.editMode = params['id'] != null;
            if (this.editMode) {
                this.id = +params['id'];
            }
        });
        // since it is an angular observer the unsuscribe can be omitted
    }
}
```
navigate to a new recipe creation page:
```angular2html
<!-- recipe-list.component.html -->
<div class="row">
    <div class="col-xs-12">
        <button 
            class="btn btn-success"
            (click)="onNewRecipe()"
            >New Recipe</button>
    </div>
</div>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class RecipeListComponent implements OnInit {
    // ...

    constructor(
        // ...
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    onNewRecipe() {
        this.router.navigate(['new'], { relativeTo: this.route });
    }
}
```
navigatng to the edit page:
```angular2html
<!-- recipe-detail.component.html -->
<!-- ... -->
    <li><a style="cursor: pointer;" (click)="onEditRecipe()">Edit Recipe</a></li>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class RecipeDetailComponent implements OnInit {
    // ...
    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    // ...

    onEditRecipe() {
        // both approaches are valid
        // this.router.navigate(['edit'], { relativeTo: this.route });
        this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
    }

    // ...
}
```

## Observables

Observables allow to replace the event emitter with a better pattern, 
the **Subject**:
```typescript
export class ShoppingListService {
    // ...

    // public ingredientsChanged = new EventEmitter<Ingredient[]>();
    public ingredientsChanged = new Subject<Ingredient[]>();

    // ...

    addIngredient(ingredient: Ingredient): void {
        this.ingredients.push(ingredient);
        // this.ingredientsChanged.emit(this.ingredients.slice());
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]): void {
        this.ingredients.push(...ingredients); // spread operator
        // this.ingredientsChanged.emit(this.ingredients.slice());
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}
```
the subscription syntax remains the same, but it is a good practice
to store the subscription and unsubscribe to it:
```typescript
@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ...
    private shoppingListSubscription: Subscription | undefined;

    // ...

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngredients();
        this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
            // ...
        );
    }

    ngOnDestroy(): void {
        if (this.shoppingListSubscription) {
            this.shoppingListSubscription.unsubscribe();
        }
    }
}
```

## Forms

### import

To work with the forms it is necessary to import the FormsModule:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        FormsModule
    ],
    // ...
})
export class AppModule { }
```

### Shopping List With Template Form

The form can be updated in the html in this way:
```angular2html
<!-- shopping-edit.component.html -->
<!-- added ngSubmit and form parameter type -->
<form (ngSubmit)="onAddItem(f)" #f="ngForm">
  <div class="row">
    <div class="col-sm-5 form-group">
        <label for="name">Name</label>
        <input 
        type="text"
        id="name"
        class="form-control"
        <!-- added name and ngModel to access from typescript -->
        name="name"
        ngModel
        required
        />
        <!-- #nameInput -->
        <!-- /> -->
    </div>
    <div class="col-sm-2 form-group">
        <label for="amount">Amount</label>
        <input 
        type="number"
        id="amount"
        class="form-control"
        <!-- added name and ngModel to access from typescript -->
        name="amount"
        ngModel
        required
        <!-- not null or negative amounts -->
        [pattern]="'^[1-9]+[0-9]*$'"
        <!-- or  pattern="^[1-9]+[0-9]*$" -->
        />
        <!-- #amountInput -->
        <!-- /> -->
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12">
        <button 
            class="btn btn-success"
            type="submit"
            [disabled]="!f.valid"
            >Add</button>
            <!-- removed on click, added ngSubmit instaed -->
            <!-- (click)="onAddItem()" -->
            <!-- >Add</button> -->
        <button class="btn btn-danger" type="button">Delete</button>
        <button class="btn btn-primary" type="button">Clear</button>
    </div>
  </div>
</form>
```
and in the component:
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit {
    // not necessary anymore
    // @ViewChild('nameInput') nameInputReference: ElementRef = {} as ElementRef;
    // @ViewChild('amountInput') amountInputReference: ElementRef = {} as ElementRef;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {}

    onSubmit(form: NgForm) { // added input parameter
        // const name = this.nameInputReference.nativeElement.value;
        // const amount = this.amountInputReference.nativeElement.value;
        const {name, amount} = form.value;
        const ingredient = new Ingredient(name, amount);
        this.shoppingListService.addIngredient(ingredient);
    }
}
```

### Update Ingredient Template Form

It is possible to load an item in the template form in this way:
```angular2html
<!-- shopping-list.component.html -->
<!-- ... -->
 <a 
      class="list-group-item" style="cursor: pointer"
      *ngFor="let ingredient of ingredients; let i = index"
      <!-- new method -->
      (click)="onEditItem(i)"
      >
      {{ingredient.name}} ({{ingredient.amount}})
  </a>
<!-- ... -->
```
needed changed in the service
```typescript
export class ShoppingListService {
    // ...
    public startedEditing = new Subject<number>();

    // ...

    getIngredient(index: number): Ingredient {
        return this.ingredients[index];
    }

    // ...

    updateIngredient(index: number, newIngredient: Ingredient): void {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    // ...
}
```
changes on the list
```typescript
@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ...
    private shoppingListSubscription: Subscription | undefined;

    // ...

    ngOnInit(): void {
        // ...
        this.shoppingListSubscription = this.shoppingListService.ingredientsChanged.subscribe(
            (ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
            },
        );
    }

    onEditItem(index: number) {
        this.shoppingListService.startedEditing.next(index);
    }

    ngOnDestroy(): void {
        if (this.shoppingListSubscription) {
            this.shoppingListSubscription.unsubscribe();
        }
    }
}
```
changes in the item edit:
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f') shoppingListForm: NgForm | undefined;
    private startedEditingSubscription: Subscription;
    private editMode: boolean = false;
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
        const { name, amount } = form.value;
        const ingredient = new Ingredient(name, amount);
        if (this.editMode && this.editedItemIndex !== undefined) {
            this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
        } else {
            this.shoppingListService.addIngredient(ingredient);
        }
        // reset the form
        this.editMode = false;
        form.reset();
    }

    ngOnDestroy(): void {
        this.startedEditingSubscription.unsubscribe();
    }
}
```

in the end the delete and clear functionalities can be updated in this way:
```typescript
export class ShoppingListService {
    // ...

    updateIngredient(index: number, newIngredient: Ingredient): void {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number): void {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    // ...
}
```
```angular2html
<!-- shopping-edit.component.html -->
<!-- ... -->
  <div class="row">
    <div class="col-xs-12">
        <button 
            class="btn btn-success"
            type="submit"
            [disabled]="!f.valid"
            >{{editMode ? 'Update' : 'Add'}}</button>
            <!-- (click)="onAddItem()" -->
            <!-- >Add</button> -->
        <button 
            class="btn btn-danger"
            type="button"
            *ngIf="editMode"
            (click)="onDelete()"
            >Delete</button>
        <button
            class="btn btn-primary"
            type="button"
            (click)="onClear()"
            >Clear</button>
    </div>
  </div>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    // ...

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

    // ...
}
```

### Recipe Item With Reactive Form

The reactive Module must be imported in the app module:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        ReactiveFormsModule
    ],
    // ...
})
export class AppModule {}
```
The form looks like:
```angular2html
<!-- recipe-edit.component.html -->
<div class="row">
    <div class="col-xs-12">
        <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
            <div class="row">
                <div class="col-xs-12">
                    <button type="submit" class="btn btn-success">Save</button>
                    <button type="submit" class="btn btn-danger">Cancel</button>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input 
                            type="text"
                            id="name"
                            class="form-control"
                            formControlName="name" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-group">
                        <label for="imagePath">Image Url</label>
                        <input 
                            type="text"
                            id="imagePath"
                            class="form-control"
                            formControlName="imagePath" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <img src="" class="img=responsive" />
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea 
                            type="text"
                            id="description"
                            class="form-control"
                            rows="6"
                            formControlName="description" >
                            </textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div 
                    class="col-xs-12"
                    formArrayName="ingredients"
                    >
                    <div 
                        class="row"
                        *ngFor="let ingredientControl of controls; let i = index"
                        [formGroupName]="i"
                        style="margin-top: 10px;"
                        >
                        <div class="col-xs-8">
                            <input 
                                type="text"
                                class="form-control"
                                formControlName="name"
                                />
                        </div>
                        <div class="col-xs-2">
                            <input 
                                type="number"
                                class="form-control"
                                formControlName="amount"
                                />
                        </div>
                        <div class="col-xs-2">
                            <button 
                                type="button"
                                class="btn btn-danger"
                                >X</button>
                        </div>
                    </div>
                    <hr/>
                    <div class="row">
                        <div class="col-xs-12">
                            <button 
                                type="button"
                                class="btn btn-success"
                                (click)="onAddIngredient()"
                                >Add Ingredient</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
```
the logic is:
```typescript
@Component({
    // ...
})
export class RecipeEditComponent implements OnInit {
    id: number | undefined;
    editMode: boolean = false;
    recipeForm: FormGroup;

    constructor(private route: ActivatedRoute, private recipeService: RecipeService) {
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
            const recipe = this.recipeService.getRecipe(this.id);
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;
            if (recipe.ingredients) {
                for (let ingredient of recipe.ingredients) {
                    recipeIngredients.push(
                        new FormGroup({
                            name: new FormControl(ingredient.name),
                            amount: new FormControl(ingredient.amount),
                        }),
                    );
                }
            }
        }

        return new FormGroup({
            name: new FormControl(recipeName),
            imagePath: new FormControl(recipeImagePath),
            description: new FormControl(recipeDescription),
            ingredients: recipeIngredients,
        });
    }

    get controls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl(),
                amount: new FormControl(),
            }),
        );
    }

    onSubmit() {
        console.log(this.recipeForm);
    }
}
```

### Reactive Validation

The validation can be added in the typescript code:
```typescript
@Component({
    // ...
})
export class RecipeEditComponent implements OnInit {
    // ...

    private initForm(): FormGroup {
        // ...

        if (this.editMode && this.id !== undefined) {
            // ...
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

        // ...
    }

    // ...

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

    // ...
}
```
it fan be used in to disable the save button:
```angular2html
<!-- recipe-edit.component.html -->
<!-- ... -->
    <button 
        type="submit"
        class="btn btn-success"
        [disabled]="!recipeForm.valid"
                        >Save</button>
<!-- ... -->
```
and the default classes can be used to style the errors:
```css
input.ng-invalid.ng-touched,
textarea.ng-invalid.ng-touched {
    border: 1px solid red;
}
```

### Creating Updating Or Deleting Recipes

Once finished the preparation the recipes must added or updated 
in the service:
```typescript
@Injectable()
export class RecipeService {
    // ...

    recipeChanged = new Subject<Recipe[]>();

    // ...

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}
```
in the edit component:
```typescript
@Component({
    // ...
})
export class RecipeEditComponent implements OnInit {
    // ...

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipeService,
    ) {
        this.recipeForm = this.initForm();
    }

    // ...

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
            this.recipeService.updateRecipe(this.id, recipe);
        } else {
            this.recipeService.addRecipe(recipe);
        }
        // console.log(this.recipeForm);
        this.onCancel();
    }
}
```
```angular2html
<!-- recipe-edit.component.html -->
<!-- ... -->
    <button 
        class="btn btn-danger"
        (click)="onCancel()"
        >Cancel</button>
<!-- ... -->
    <button 
        type="button"
        class="btn btn-danger"
        (click)="onDeleteIngredient(i)"
        >X</button>
<!-- ... -->
```
to correctly display the new list, also the recipe list component
must be updated:
```typescript
@Component({
    // ...
})
export class RecipeListComponent implements OnInit, OnDestroy {
    // ...
    recipeChangedSubscription: Subscription;

    constructor( /* ... */) {
        this.recipeChangedSubscription = this.recipeService.recipeChanged.subscribe(
            (recipes: Recipe[]) => {
                this.recipes = recipes;
            },
        );
    }

    ngOnInit(): void {
        // still needed for first load
        this.recipes = this.recipeService.getRecipes();
    }

    // ...

    ngOnDestroy(): void {
        this.recipeChangedSubscription.unsubscribe();
    }
}
```
and for the deletion nust be updated the recipe edit component:
```typescript
@Component({
    // ...
})
export class RecipeDetailComponent implements OnInit {
    // ...

    onDeleteRecipe() {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['/recipes'])
    }
}
```
```angular2html
<!-- recipe-detail.component.html -->
<!-- ... -->
    <li><a style="cursor: pointer;" (click)="onDeleteRecipe()">Delete Recipe</a></li>
<!-- ... -->
```

### Correctly Load Image Preview

The image preview can be correctly displayed in this way:
```angular2html
<!-- recipe-edit.component.html -->
<!-- ... -->
    <div class="row">
        <div class="col-xs-12">
            <div class="form-group">
                <label for="imagePath">Image Url</label>
                <input 
                    type="text"
                    id="imagePath"
                    class="form-control"
                    formControlName="imagePath" 
                    <!-- refenrece  -->
                    #imagePath
                    />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <!-- bind src to reference -->
            <img [src]="imagePath.value" class="img=responsive" />
        </div>
    </div>
<!-- ... -->
```

### Fix Service

Every time the page is changed, the recipe service is recreated from scratch
since it is injected in the Recipes component.\
To avoid this behaviour it must be injected at the app module level:
```typescript
@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css'],
    // providers: [RecipeService],
})
export class RecipesComponent implements OnInit {
    // ...
}
```
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    // ...
    providers: [ShoppingListService, RecipeService],
    // ...
})
export class AppModule { }
```








































