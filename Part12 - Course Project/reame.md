# Course Project

- [The Basics](#the-basics)
- [](#)
- [](#)
- [](#)
- [](#)

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









