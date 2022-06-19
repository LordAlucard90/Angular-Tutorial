# Standalone Components

## Content

- [Intro](#intro)
- [Integration](#integration)
- [Directives](#directives)
- [Services](#services)
- [Routing](#routing)
- [Lazy Loading](#lazy-loading)

---

## Intro

The idea behind Standalone Components is to get rid off the NgModules.

It is possible to transform a Component in a standalone one,
just by setting the standalone property to true:
```typescript
@Component({
    standalone: true,
    // ...
})
export class DetailsComponent {
    // ...
}
```

## Integration

First of all a standalone Component cannot be declared in the NgModule declarations,
therefore must be removed:
```typescript
@NgModule({
    declarations: [
        AppComponent, 
        WelcomeComponent,
        // DetailsComponent // removed
    ],
    imports: [
        BrowserModule,
        SharedModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

but it is still necessary to make Angular aware of it,
to do this there are two possible approaches:
- hybrid
- full standalone

### Hybrid

In order to maintain compatibility with old components, 
it is possible to just move the declaration of the component 
from the declarations to the imports:
```typescript
@NgModule({
    declarations: [
        AppComponent, 
        WelcomeComponent,
    ],
    imports: [
        BrowserModule,
        SharedModule,
        DetailsComponent, // added
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

### Full Standalone

The other way possible after a full migration is to declare the component
directly in the import:
```typescript
@Component({
    imports: [
        DetailsComponent // added
    ],
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
})
export class WelcomeComponent {}
```

## Directives

In the import of the `@Component` it is also possible to import modules
or directives. To correctly use the `HighlightDirective` is then possible
to import the `SharedModule` in the `DetailsComponent`:
```typescript
@Component({
    standalone: true,
    imports: [
        SharedModule
    ],
    // ...
})
export class DetailsComponent {
    // ...
}
```

### Standalone Directives

It is possible to migration the `HighlightDirective` to be standalone
in the same way as for the components:
```typescript
@Directive({
    standalone: true,
    // ...
})
export class HighlightDirective {
    // ...
}
```
as for the component it must be removed from the module's declarations:
```typescript
// not needed anymore
// @NgModule({
//   declarations: [HighlightDirective],
//   exports: [HighlightDirective],
// })
// export class SharedModule {}
```
and the directive can be imported directly in the component:
```typescript
@Component({
    standalone: true,
    imports: [
        // SharedModule
        HighlightDirective
    ],
    // ...
})
export class DetailsComponent {
    // ...
}
```

## Standalone Root

In order to be able to transform the root components as standalone, 
first it is necessary to transform the other components as standalone:
```typescript
@Component({
    standalone: true,
    imports: [
        DetailsComponent
    ],
    // ...
})
export class WelcomeComponent {}
```
Now it is possible to migrate the root:
```typescript
@Component({
    standalone: true,
    imports: [
        WelcomeComponent
    ],
    // ...
})
export class AppComponent {}
```
and remove all the references from the NgModule:
```typescript
@NgModule({
    declarations: [
        // AppComponent, 
        // WelcomeComponent,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ],
})
export class AppModule {}
```

But in order to make it work, it is necessary to change how the application 
itself is loaded in the `main.ts`:
```typescript
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

bootstrapApplication(AppComponent);
```
therefore now it is possible to delete `AppModule`.

## Services

If the `providedIn` property is set, the service will be automatically see
by all the components that need it:
```typescript
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // ...
}
```
Alternatively, it is possible to use the providers inside the 
`@Component` definition:
```typescript
@Component({
    // ...
    providers: [
        AnalyticsService
    ]
})
```
with this solution, each component will ge its own instance of the service.

Last way is to provide it in the `main.ts`:
```typescript
bootstrapApplication(AppComponent, {
    providers: [
        AnalyticsService
    ]
});
```

## Routing

Given a `RoutingModule`:
```typescript
const routes: Route[] = [
  // ...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```
In order to use the `router-outlet` and the `routerLink` in the template,
it is necessary to add the `RouterModule` to the `AppComponent`:
```typescript
@Component({
    // ...
    imports: [
        // ...
        RouterModule
    ],
    // ...
})
export class AppComponent {}
```
and in order to make Angular aware of the routes,
ii is necessary to update the `main.ts`:
```typescript
bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule)
    ]
});
```

The lazy components are still loaded lazily.

## Lazy Loading

The previous step uses a hybrid solution, where standalone components
work with non standalone ones that are inside a module.

Normal and standalone components can be declared in the routes definition
in the same way.\
But it is possible to define lazy loaded components in this way:
```typescript
const routes: Route[] = [
    // ...
    {
        path: 'about',
        // component: AboutComponent,
        loadComponent: () => import('./about/about.component').then(mod => mod.AboutComponent),
    },
    // ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```
this means that now it is possible to lazy load components directly without
the need to wrap them inside module.

Furthermore, it is possible to load multiple standalone components at once
defining a constant:
```typescript
export const DASHBOARD_ROUTES: Route[] = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'today',
        component: TodayComponent
    }
]
```
to make Angular aware of it, 
it is necessary to update the routing's routes definition to:
```typescript
const routes: Route[] = [
    // ...
    {
        path: 'dashboard',
        // loadChildren: () =>
        //     import('./dashboard/dashboard-routing.module').then(mod => mod.DashboardRoutingModule),
        loadChildren: () =>
            import('./dashboard/routes').then(mod => mod.DASHBOARD_ROUTES),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```

