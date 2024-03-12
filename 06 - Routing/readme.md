# Routing

## Content

- [Intro](#intro)
- [Programmatic Navigation](#programmatic-navigation)
- [Query Parameters](#query-parameters)
- [Improving Routing](#improving-routing)
- [Passing Data](#passing-data)

---

## Intro

Routing helps to show the user different urls 
even if the page does not really change.

### Configuring Routes

The routes are usually registered on **app.module**:

```typescript
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'servers', component: ServersComponent },
];
@NgModule({
  // ...,
  imports: [
    // ...,
    RouterModule.forRoot(appRoutes)
  ],
  // ...
})
```

Every route needs a path, that will be displayed on the url,
and a component to load.

`RouterModule.forRoot` registers the routes into Angular.

To correctly load the routes in the page is used the `router-outlet`:

```angular2html
<div class="row">
  <div class="col-12 col-sm-10 col-md-10 col-sm-offset-1 col-md-offset-2">
    <router-outlet></router-outlet>
  </div>
</div>
```

### Set Up Navigation

It is possible set manually the navigation link:

```angular2html
...
<a class="nav-link active" href="/">Home</a>
...
<a class="nav-link" href="/servers">Servers</a>
...
<a class="nav-link" href="/users">Users</a>
...
```

Unfortunately in this way the app is reloaded every time. 

The correct way to load the component is:

```angular2html
...
<a class="nav-link active" routerLink="/">Home</a>
...
<a class="nav-link" routerLink="/servers">Servers</a>
...
<a class="nav-link" routerLink="/users">Users</a>
...
```

Another way to user `routerLink` is:

```angular2html
<a class="nav-link" [routerLink]="['/page', '/subpage']">link</a>
```

This way allows to build complex path easily.

### Navigation Path

The `routerLink` can have:

- **Absolute Path** - `routerLink="/path"`
  - in this case Angular will go to `/path` url.
- **Relative Path** - `routerLink="path"` or `routerLink="./path"`
  - in this case Angular will go to `current_path/path` url.
  - it is also possible to use `routerLink="../path"` to move 
  to `parent_path/path` url

### Styling Active Router Link

Is is possible to add a custom class to an element route if it is active
with `routerLinkActive`:

```angular2html
...
<a class="nav-link" routerLink="/" routerLinkActive="active">Home</a>
...
<a class="nav-link" routerLink="/servers" routerLinkActive="active">Servers</a>
...
<a class="nav-link" routerLink="/users" routerLinkActive="active">Users</a>
...
```

For `/servers` and `/users` the `/` like is active because`routerLinkActive`
checks only if the current path is equal or a child of the `routerLink`.

To force the equality check, it is necessary to add `routerLinkActiveOptions`:

```angular2html
<a class="nav-link" 
    routerLink="/" 
    routerLinkActive="active"
    [routerLinkActiveOptions]="{exact: true}">
        Home
</a>

```

## Programmatic Navigation

### Router Navigate

Is is possible to program a navigation after a computation:

```angular2html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

```typescript
import {Router} from '@angular/router';

@Component({/* ... */})
export class HomeComponent implements OnInit {
  constructor(private router: Router) { }
  // ...
  onLoadServers() {
    // do something complex
    this.router.navigate(['/servers']);
  }
}
```

### Relative Paths

When is made a request to the current url,
`Router.navigate` will not reload the page.

```angular2html
<button class="btn btn-primary" (click)="onReload()">Reload Page</button>
```

Unlike `routerLinkActive`, `Router.navigate` by default does not know
the current route, so it will use the absolute path:

```typescript
export class ServersComponent implements OnInit {
  // ...

  onReload() {
    this.router.navigate(['servers']);
  }
}
```

To use a relative path is necessary to specify the `relativeTo` property
that is '/' by default:

```typescript
import {ActivatedRoute, Router} from '@angular/router';

@Component({...})
export class ServersComponent implements OnInit {
  // ...

  constructor(/* ... */,
              private activatedRoute: ActivatedRoute) {
  }

  // ...

  onReload() {
    this.router.navigate(['servers'], {relativeTo: this.activatedRoute});
  }
}
```

In this case Angular will search `/servers/servers`.

### Route Parameters

It is possible send data through the route with the syntax `:[variale]`:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'users/:id/', component: UserComponent },
  // ...
];
```

### Retrieving Parameters

It is possible to get the url parameter through the `ActivatedRoute`:

```typescript
export class UserComponent implements OnInit {
  user: {id: number, name: string};

  constructor(private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.user = {
      id: this.activeRoute.snapshot.params['id'],
      name: this.activeRoute.snapshot.params['name']
    };
  }
}
```

Where:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'users/:id/:name', component: UserComponent },
  // ...
];
```

### Fetching Route Parameters Reactively

If from a user details component there is a link to another user like:

```angular2html
<p>User with ID {{ user.id }} loaded.</p>
<p>User name is {{ user.name }}</p>
<br>
<a [routerLink]="['/users', 10, 'Anna']">load Anna (10)</a>
```

The user info will not be reloaded because there is no change of component so,
for performance, the component will not be reloaded.

To catch the parameters change into the same component, 
it is necessary to subscribe to the `ActiveRoute.params` observable:

```typescript
export class UserComponent implements OnInit {
  // ...

  ngOnInit() {
    this.user = {
      id: this.activeRoute.snapshot.params['id'],
      name: this.activeRoute.snapshot.params['name']
    };
    this.activeRoute.params.subscribe(
      (params: Params) => {
        this.user.id = params['id'];
        this.user.name = params['name'];
      }
    );
  }
}
```

`snapshot` is used on every creation.

`params` subscription is used only if the route changes inside the same
component.

### Subscription Life Cycle

By default a subscription is destroyed when a component is destroyed.

It is possible anyway to destroy it manually:

```typescript
export class UserComponent implements OnInit, OnDestroy {
  user: {id: number, name: string};
  paramsSubscription: Subscription;

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    // ...
    this.paramsSubscription = this.activeRoute.params.subscribe(...);
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
```

## Query Parameters

### Passing Params

It is possible pass query parameters and fragment parameter:

```angular2html
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit: '1'}"
  [fragment]="'loading'"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers">
  {{ server.name }}
</a>
```
The generated path will be: `/servers/5/edit?allowEdit=1#loading`

It is possible to do the same thing programmatically:

```typescript
export class HomeComponent implements OnInit {
  // ...

  onLoadServer(id: number) {
    this.router.navigate(
      ['/servers', id, 'edit'],
      {queryParams: {allowEdit: '1'}, fragment: 'loading'}
      );
  }
}
```

```angular2html
<button class="btn btn-primary" (click)="onLoadServer(1)">Load Server 1</button>
```

### Retrieving Params

Like for `params`, it is possible for to get `queryParams` and `fragment` 
through **snapshot** or **subscribe**:

```typescript
console.log(this.activeRoute.snapshot.queryParams);
console.log(this.activeRoute.snapshot.fragment);
this.activeRoute.queryParams.subscribe();
this.activeRoute.fragment.subscribe();
```

### Params Conversion

By default the params retrieved are string, therefore,
an `id` must be converted to a **number**:

```typescript
id = Number(this.activateRoute.snapshot.params['id'])
// or
id = +this.activateRoute.snapshot.params['id']
```

### Nested Routes

It is possible create nested routes:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'servers', component: ServersComponent, children: [
    { path: ':id', component: ServerComponent },
    { path: ':id/edit', component: EditServerComponent },
    ] },
];
```
And manage the nested component easily:

```angular2html
<div class="col-xs-12 col-sm-4">
  <router-outlet></router-outlet>
  <!--<button class="btn btn-primary" (click)="onReload()">Reload Page</button>-->
  <!--<app-edit-server></app-edit-server>-->
  <!--<hr>-->
  <!--<app-server></app-server>-->
</div>
```

### Nested Routes Queries

By default, navigating from a component to another,
as from a server to its edit page, will loose all the url params of the first:

```
/servers/1?allowEdit=1#loading -> /servers/1/edit
```

### Query Params Handling

Query Params Handling has some possible options:

- **merge** - merges the old query parameters with the new ones.
- **preserve** - keeps the old query parameters.

By default the behaviour is to drop the old query parameters.

```typescript
export class ServerComponent implements OnInit {
  // ...

  onEdit() {
    this.router.navigate(
      ['edit'],
      {
        relativeTo: this.activateRoute,
        queryParamsHandling: 'preserve'
      }
      );
  }
}
```

### 404

It is possible redirect a non existing page to a **404** component
with the path matching  `**` and the property `redirectTo`:

```typescript
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  // ...,
  { path: 'not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo: '/not-found'},
];
```

The `**` must be the **last one** because it will always match the current url.

If there is a wrong url on a nested component path,
this syntax will not catch the error.

## Improving Routing

### Outsourcing Routes

To keep all the routes ordered,
it is possible move them in a module**app-routing.module.ts** :

```typescript
const appRoutes: Routes = [/* ... */];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
```

And import the new module in the **app.module.ts**:

```typescript
@NgModule({
  // ...,
  imports: [
    // ...,
    AppRoutingModule
  ],
  // ...
})
export class AppModule { }
```

### Route Guards

It is possible execute some checks before navigate to and from a page.

#### canActivate

Is is possible declare an **AuthGuardService**
that will check the authentication state:

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

The guard is added to a route and to all its child in this way:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'servers',
    canActivate: [AuthGuardService],
    component: ServersComponent,
    children: [/* ... */] },
  // ...
];
```

It is also possible set a guard only to children of a rout by implementing
the `CanActivateChild` interface:

```typescript
import { /* ... */, CanActivateChild} from '@angular/router';
// ...

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  // ...

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
```

To set the guard only to children is necessary change the route guard definition:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'servers',
    // canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    component: ServersComponent,
    children: [...]},
  // ...
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

`CanComponentDeactivate` is component interface that the route component
must implement to allow the check before the leaving:

```typescript
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  // ...
  changesSaved = false;

  constructor(private serversService: ServersService,
              private activeRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {/* ... */}

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

As the previous guards, it has to be added to the route definition:

```typescript
const appRoutes: Routes = [
  // ...,
  { path: 'servers',
    // ...,
    children: [
      // ...,
      { path: ':id/edit',
        component: EditServerComponent,
        canDeactivate: [CanDeactivateGuardService]},
    ] },
  // ...
];
```

## Passing Data

### Static Data

It is possible create a new generic error page with a variable error message:

```angular2html
<h4> {{ errorMessage }}</h4>
```
It is possible pass static data to a route in the route definition:

```typescript
const appRoutes: Routes = [
  ...,
  // { path: 'not-found', component: PageNotFoundComponent},
  { path: 'not-found',
    component: ErrorPageComponent,
    data: {message: 'Page Not Found!'}},
  { path: '**', redirectTo: '/not-found'},
];

```
And retrieve the data value in the route component:

```typescript
export class ErrorPageComponent implements OnInit {
  errorMessage: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.errorMessage = this.activatedRoute.snapshot.data['message'];
    this.activatedRoute.data.subscribe(
      (data: Data) => {
        this.errorMessage = data['message'];
      }
    )
  }
}
```

### Dynamic Data

It is possible load data of a component after the component creation
in the `ngOnInit` method or before it, and pass it to the component route:

```typescript
const appRoutes: Routes = [
  ...,
  { path: 'servers',
    ...,
    children: [
      { path: ':id',
        component: ServerComponent,
        resolve: {server: ServerResolverService}},
      ...
    ] },
  ...
];
```

The resolved data is stored in the `data` variable:

```typescript
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};

  constructor(private serversService: ServersService,
              private activateRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.server = this.activateRoute.snapshot.data['server'];
    this.activateRoute.data.subscribe(
      (data: Data) => {
        this.server = data['server'];
      }
    );
  }
  
  ...
}
```

The resolver service must implement the `Resolver` interface:

```typescript
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ServersService} from './servers.service';

interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolverService implements Resolve<Server> {
  constructor(private serverService: ServersService) {}

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Server> | Promise<Server> | Server {
    return this.serverService.getServer(Number(route.params['id']));
  }

}
```

In this case the data is immediately resolved,
but it could be also retrieved from a HTTP request.

### Location Strategies

All the routes are managed by Angular so on a real server, not
correctly configured, it will be raised a 404 page.

To avoid the 404 server page, all the possible request must be directed
to the `index.html` file that provides the Angular application.

If this is not possible, there is also the `hashtag` alternative:

```typescript
...
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  ...
})
export class AppRoutingModule {}
```

This option will add a `#` between the server path and the route path:

- http://localhost:4200/#/
- http://localhost:4200/#/server
- http://localhost:4200/#/users

With this option the server will only take care of the part before the hashtag
and the Angular application will take care of the other part.

