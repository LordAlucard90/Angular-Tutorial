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
