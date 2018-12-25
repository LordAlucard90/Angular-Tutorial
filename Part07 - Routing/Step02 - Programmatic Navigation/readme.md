# Step 02 - Programmatic Navigation

## Router Navigate

Is is possible program a navigation after a computation:

```angular2html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

```typescript
import {Router} from '@angular/router';

@Component({...})
export class HomeComponent implements OnInit {
  ...

  onLoadServers() {
    // do something complex
    this.router.navigate(['/servers']);
  }
}
```

---

## Relative Paths

When is made a request to the current orl `Router.navigate` will not reload the page.

```angular2html
<button class="btn btn-primary" (click)="onReload()">Reload Page</button>
```

Unlike `routerLinkActive`, `Router.navigate` by default does not know the current route, so it will use the absolute path:

```typescript
export class ServersComponent implements OnInit {
  ...

  onReload() {
    this.router.navigate(['servers']);
  }
}
```

To use a relative path is necessary to specify the `relativeTo` property that is '/' by default:

```typescript
import {ActivatedRoute, Router} from '@angular/router';

@Component({...})
export class ServersComponent implements OnInit {
  ...

  constructor(...,
              private activatedRoute: ActivatedRoute) {
  }

  ...

  onReload() {
    this.router.navigate(['servers'], {relativeTo: this.activatedRoute});
  }
}
```

In this case Angular will search `/servers/servers`.

---

## Route Parameters

It is possible send data through the route with the syntax `:[variale]`:

```typescript
const appRoutes: Routes = [
  ...,
  { path: 'users/:id/', component: UserComponent },
  ...
];
```

## Retrieving Parameters

It is possible get the url parameter through the `ActivatedRoute`:

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
  ...,
  { path: 'users/:id/:name', component: UserComponent },
  ...
];
```
---

## Fetching Route Parameters Reactively

If from a user details component there is a link to another user like:

```angular2html
<p>User with ID {{ user.id }} loaded.</p>
<p>User name is {{ user.name }}</p>
<br>
<a [routerLink]="['/users', 10, 'Anna']">load Anna (10)</a>
```

The user info will not be reloaded because there is no change od component so, for performance, the component will not be reloaded.

To catch the parameters change into the same component is necessary to subscribe to the `ActiveRoute.params` observable:

```typescript
export class UserComponent implements OnInit {
  ...

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

`params` subscription is used only if the route change inside the same component.

---

## Subscription Lifecycle

By default a subscription is destroyed when a component is destroyed.

It is possible anyway to destroy it manually:

```typescript
export class UserComponent implements OnInit, OnDestroy {
  user: {id: number, name: string};
  paramsSubscription: Subscription;

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    ...
    this.paramsSubscription = this.activeRoute.params.subscribe(...);
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
```
