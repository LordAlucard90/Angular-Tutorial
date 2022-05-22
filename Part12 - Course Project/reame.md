# Course Project

- [The Basics](#the-basics)
- [Components And Data Binding Deep Dive](#components-and-databinding-deep-dive)
- [Directives Deep Dive](#directives-deep-dive)
- [Services And Dependency Injection](#services-and-dependency-injection)
- [Routing](#routing)
- [Observables](#observables)

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



































