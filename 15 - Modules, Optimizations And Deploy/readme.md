# Modules, Optimizations And Deploy

## Content

- [Modules](#modules)
- [Feature Modules](#feature-modules)
- [Shared Modules](#shared-modules)
- [Core Modules](#core-modules)
- [Lazy Loading](#lazy-loading)
- [Compilation](#compilation)
- [Deployment](#deployment)

---

## Modules

[Official Documentation](https://angular.io/guide/ngmodules)

The main app module definition is divided in:
- **declarations**: list of components, directives and custom pipes used in the module
- **imports**: list of other modules used in this module
- **providers**: list of services that need to be injected (or using `providedIn: 'root'`)
- **bootstrap**: the component that start the module

The routing module could been have declared in the main, but in order to keep
everything cleaner it is better to separate it.
It contains:
- **imports**: the Router module with a special declaration syntax
- **exports**: the router module itself in order to be available in the modules where it is imported

by default each module works by its own and its components are not visible 
by the other modules.

It is possible to split a modules into features modules, this improve usage,
re-usability and optimization.

## Feature Modules

All the components and other modules must be redeclared in each module,
only services can be declared only in the root module and can be available
to all the application.

### First definition
A first configuration of the RecipesModule is:
```typescript
@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports: [
        // import CommonModule in the sub-modules for ngIf and ngFor
        CommonModule,
        ReactiveFormsModule,
    ],
    // must be exported to be available to the other parts of the application
    exports: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
})
export class RecipesModule {}
```

In the app module it is then possible to remove the recipes' components 
and to import the RecipesModule instead:
```typescript
@NgModule({
    declarations: [
        // RecipesComponent,
        // RecipeListComponent,
        // RecipeDetailComponent,
        // RecipeItemComponent,
        // RecipeStartComponent,
        // RecipeEditComponent,
        // ...
    ],
    imports: [
        // ...
        RecipesModule,
    ],
    providers: [
        // ...
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

### Extract Routes

The recipes' routes removed from the AppRoutingModule:
```typescript
const routes: Routes = [
    // ...
    // {
    //     path: 'recipes',
    //     component: RecipesComponent,
    //     canActivate: [AuthGuard],
    //     children: [
    //         { path: '', component: RecipeStartComponent },
    //         { path: 'new', component: RecipeEditComponent },
    //         { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
    //         { path: ':id/edit', component: RecipeEditComponent },
    //     ],
    // },
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
```
and added to a new RecipesRoutingModule:
```typescript
const routes: Routes = [
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
            { path: ':id/edit', component: RecipeEditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RecipesRoutingModule {}
```
and now can be imoprted in the 
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        RecipesRoutingModule,
    ],
    // export not needed anymore, now everything remains in the module
    // exports: [
    //     RecipesComponent,
    //     RecipeListComponent,
    //     RecipeDetailComponent,
    //     RecipeItemComponent,
    //     RecipeStartComponent,
    //     RecipeEditComponent,
    // ],
})
export class RecipesModule {}
```

### ShoppingListModule

The same procedure can be preformed for the shopping-list.
```typescript
const routes: Routes = [{ path: 'shopping-list', component: ShoppingListComponent }];

@NgModule({
    declarations: [ShoppingListComponent, ShoppingEditComponent],
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class ShoppingListModule {}
```
and the AppModule can be updated:
```typescript
@NgModule({
    declarations: [
        // ...
        // ShoppingListComponent,
        // ShoppingEditComponent,
    ],
    imports: [
        // ...
        ShoppingListModule,
    ],
    providers: [
        // ...
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
with the router that has become:
```typescript
const routes: Routes = [
    // ...
    // { path: 'shopping-list', component: ShoppingListComponent },
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
```

## Shared Modules

A shared module is just a feature module that focusses itself in the share:
```typescript
@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective,
    ],
    imports: [CommonModule],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule
    ],
    // up to Angular 8
    // entryComponents: [AlertComponent],
})
export class SharedModule {}
```
this SharedModule can now be imported in the other modules:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        // CommonModule,
        SharedModule, // includes CommonModule
    ],
})
export class RecipesModule {}
```
```typescript
const routes: Routes = [{ path: 'shopping-list', component: ShoppingListComponent }];

@NgModule({
    declarations: [ShoppingListComponent, ShoppingEditComponent],
    imports: [FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class ShoppingListModule {}
```
since it is possible to declare a component/directive/pipe only once in the
application, the AppModule Must be cleaned:
```typescript
@NgModule({
    declarations: [
        // ...
        // DropdownDirective,
        // LoadingSpinnerComponent,
        // AlertComponent,
        // PlaceholderDirective,
    ],
    imports: [
        // ...
        SharedModule,
    ],
    providers: [
        // ...
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

## Core Modules

The idea of the core module is to manage all the services in one place
and provide them in this way to all the application.

In our case the interceptors must be managed in this way.
```typescript
@NgModule({
    providers: [
        ShoppingListService,
        RecipeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
})
export class CoreModule {}
```
then AppModule can be updated:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        CoreModule,
    ],
    // not Needed anymore
    // providers: [
    //     ShoppingListService,
    //     RecipeService,
    //     {
    //         provide: HTTP_INTERCEPTORS,
    //         useClass: AuthInterceptorService,
    //         multi: true,
    //     },
    // ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

Important: ysing the pattern `@Injectable({ providedIn: 'root' })` it is not
needed anymore.


## Lazy Loading

The idea of lazy loading is to load at the start of the application only 
the root module and the modules directly connected with the queried route.
The other modules can be loaded just when needed.

To enable this feature, it is necessary to change the base route of the 
sub-module as empty:
```typescript
const routes: Routes = [
    {
        path: '', // path: 'recipes',
        // ...
];

@NgModule({
    // ...
})
export class RecipesRoutingModule {}
```
and update the root routing in this way:
```typescript
const routes: Routes = [
    // ...
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
```
It is important to clear all the imports, otherwise the app will load everything
is imported, even if not used.
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        // RecipesModule,
        // ...
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

The same can be done for shopping-list:
```typescript
const routes: Routes = [
    {
        path: '', // path: 'shopping-list',
        component: ShoppingListComponent,
    },
];

@NgModule({
    // ...
})
export class ShoppingListModule {}
```
and the auth:
```typescript
const routes: Routes = [
    {
        path: '', // path: 'auth',
        component: AuthComponent,
    },
];

@NgModule({
    // ...
})
export class AuthModule {}
```
and as before the router is updated:
```typescript
const routes: Routes = [
    // ...
    {
        path: 'shopping-list',
        loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```
and the not needed anymore imports removed:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        // ShoppingListModule,
        // AuthModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
on `ng serve` will be displayed something like 
```
Initial Chunk Files                                      | Names                              |  Raw Size
vendor.js                                                | vendor                             |   2.06 MB | 
polyfills.js                                             | polyfills                          | 294.81 kB | 
styles.css, styles.js                                    | styles                             | 286.65 kB | 
main.js                                                  | main                               |  54.96 kB | 
runtime.js                                               | runtime                            |  12.64 kB | 

                                                         | Initial Total                      |   2.70 MB

Lazy Chunk Files                                         | Names                              |  Raw Size
default-node_modules_angular_forms_fesm2015_forms_mjs.js | recipes-recipes-module             | 286.67 kB | 
src_app_recipes_recipes_module_ts.js                     | recipes-recipes-module             |  44.42 kB | 
src_app_shopping-list_shopping-list_module_ts.js         | shopping-list-shopping-list-module |  15.98 kB | 
src_app_auth_auth_module_ts.js                           | auth-auth-module                   |  12.88 kB | 
```

### Preloading

It is possible to configure Angular to load initially only the needed parts,
and then, behind the scenes, download the other parts.
In this way even if the packets size is big,
the user can directly access the different pages without waiting,
because everything was already downloaded.
```typescript
const routes: Routes = [
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Services Injection

Given the following service:
```typescript
export class LoggingService {
    lastLog: string = '';

    printLog(message: string) {
        console.log(message);
        console.log(this.lastLog);
        this.lastLog = message;
    }
}
```
and using it in
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    constructor(private authService: AuthService, private loggingService: LoggingService) {}

    ngOnInit(): void {
        this.authService.autoLogin();
        this.loggingService.printLog("Hello from AppComponent.")
    }
}
```
and
```typescript
@Component({
    // ...
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    // ...

    constructor(
        private shoppingListService: ShoppingListService,
        private loggingService: LoggingService,
    ) {}

    ngOnInit(): void {
        // ...
        this.loggingService.printLog('Hello from ShoppingListComponent.');
    }

    // ...
}
```

When the service is annotated 
```typescript
@Injectable({ providedIn: 'root' })
export class LoggingService {
    // ...
}
```
navigating from the authentication to the shopping list page,
it is possible to see the following logs:
```
> Hello from AppComponent.
> 
> Hello from ShoppingListComponent.
> Hello from AppComponent.
```
this means that the service instance is shared.

Same behaviour can be obtained with providers in the AppModule:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
    ],
    providers: [
        LoggingService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
or in the core module:
```typescript
@NgModule({
    providers: [
        // ...
        LoggingService
    ],
})
export class CoreModule {}
```

But, if the service is provided in the AppModule and in the Sh
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
    ],
    providers: [
        LoggingService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
```typescript
@NgModule({
    // ...
    providers: [LoggingService],
})
export class ShoppingListModule {}
```
will be created two instances and the resulting log will be:
```
> Hello from AppComponent.
> 
> Hello from ShoppingListComponent.
> 
```
And this is a reasonable behaviour, but the same behaviour can be achieved
adding the providers in the SharedModule
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
    ],
    exports: [
        // ...
    ],
    providers: [LoggingService],
})
export class SharedModule {}
```
this is caused by AppModule and ShoppingListModule that independently
import their own instance of SharedModule (due to lazy loading),
therefore there are two different instances of LoggingService too.

## Compilation

All the syntax used in the template is not actually DOM understandable but Angular.\
Therefore Angular have to translate all its directives into JavaScript DOM
instructions.

### Just-In-Time Compilation

Just in time translation id done at runtime in the browser.
It is the `ng serve` methodology and helps during development and debugging.

### Ahead-Of-Time Compilation

Ahead of time compilation run during build process, before the app is deployed.
It can be enabled using `ng build --prod` that creates a production build.

Note: the `--prod` flag is not anymore necessary.

Running this command it is possible to see that the generated files are smaller
because all the code needed for translation is not needed anymore:
```
Initial Chunk Files           | Names                              |  Raw Size | Estimated Transfer Size
main.42d4789a6de9a044.js      | main                               | 240.05 kB |                65.60 kB
styles.054a699817434cef.css   | styles                             | 111.74 kB |                15.33 kB
polyfills.1aa2fde42cd7f974.js | polyfills                          |  33.03 kB |                10.60 kB
runtime.a836dda7e9819798.js   | runtime                            |   2.81 kB |                 1.33 kB

                              | Initial Total                      | 387.64 kB |                92.86 kB

Lazy Chunk Files              | Names                              |  Raw Size | Estimated Transfer Size
382.03643af62caca226.js       | recipes-recipes-module             |  38.21 kB |                 7.64 kB
349.f2bcfbd00297d81b.js       | recipes-recipes-module             |  10.08 kB |                 2.71 kB
35.2c94194740615c7d.js        | auth-auth-module                   |   5.38 kB |                 1.82 kB
320.2c1907ebf535235e.js       | shopping-list-shopping-list-module |   4.23 kB |                 1.49 kB
```
the compiled files are generated inside the `dist/` folder.

## Deployment

### Environment Variables

In the `environments/` folder can be added key value pairs
in the `environment.ts` and `environment.prod.ts`
that can be used inside the application.

For example the server URL can be configured:
```typescript
// environment.ts
export const environment = {
  production: false,
  serverUrl: 'http://127.0.0.1:3000'
};
```
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  serverUrl: 'http://localhost:3000'
};
```
and can be used in the app in this way:
```typescript
@Injectable({ providedIn: 'root' })
export class DataStorageService {
    private baseUrl = `${environment.serverUrl}/recipes`;
    // ...
}
```
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = environment.serverUrl;
    // ...
}
```

### Hosting

In order to deploy the application it is necessary to built it for production
```bash
ng build --prod
```
this will create a `dist` directory with inside a folder with all the necessary
files to be used in the deployment.

The hosting procedure changes depending from the host, but in general
the static files must be uploaded in the host and that's mainly all.

It is important to be sure that the server is configured to always serve
the index.html file and not the sub ones, otherwise it will result in a 404 error.

It is also possible to use [serve](https://github.com/vercel/serve) 
to host the build result locally:
```bash
sudo npm i -g serve

serve -s dist/course-project/ # by defautl is hosted at http://localhost:3000
```
