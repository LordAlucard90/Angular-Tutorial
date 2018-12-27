# Step 04 - Improving Routing

## Outsourcing Routes

To keep all the routes ordered it is possible move them in a module **app-routing.module.ts** :

```typescript
import ...;

const appRoutes: Routes = [...];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
```

And import the new module in the **app.mosule.ts**:

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    AppRoutingModule
  ],
  ...
})
```

---

## Route Guards

It is possible execute some checks before navigate to and from a page.

#### canActivate

Is is possible declare an **AuthGuardService** that will check the authentication state:

```typescript
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated().then(
        (authenticated: boolean) => {
          if (authenticated) {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        }
      );
  }
}
```
The `CanActivate` interface manage the activation check.

The guard is added to a route and all his child in this way:

```typescript
const appRoutes: Routes = [
  ...,
  { path: 'servers',
    canActivate: [AuthGuardService],
    component: ServersComponent,
    children: [...] },
  ...
];
```

It is also possible set a guard onyl to children of a rout by implementing the `CanActivateChild` interface:

```typescript
import { ..., CanActivateChild} from '@angular/router';
...

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  ...

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
```

To set the guard only to children is necessary change the route guard definition:

```typescript
const appRoutes: Routes = [
  ...,
  { path: 'servers',
    // canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    component: ServersComponent,
    children: [...]},
  ...
];
```

#### canDeactivate

It is possible make a check before leave a route.

```typescript
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;

}

export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
```

`CanComponentDeactivate` is component interface that the route component must implement to allow the check before the leaving:

```typescript
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  ...
  changesSaved = false;

  constructor(private serversService: ServersService,
              private activeRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {...}

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.activeRoute});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    if (this.serverName !== this.server.name || this.serverStatus !== this.server.status && !this.changesSaved) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }
}
```

As the previous guard it has to be added to the route definition:

```typescript
const appRoutes: Routes = [
  ...,
  { path: 'servers',
    ...,
    children: [
      ...,
      { path: ':id/edit',
        component: EditServerComponent,
        canDeactivate: [CanDeactivateGuardService]},
    ] },
  ...
];
```



