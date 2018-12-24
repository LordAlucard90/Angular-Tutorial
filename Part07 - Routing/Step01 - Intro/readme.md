# Step 01 - Intro

Routing helps to show the user different urls even if the page does not really change.

## Configuring Routes

The routes are usually registered on **app.module**:

```typescript
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'servers', component: ServersComponent },
];
@NgModule({
  ...,
  imports: [
    ...,
    RouterModule.forRoot(appRoutes)
  ],
  ...
})
```

Every route needs a path, that will be displayed on the url, and a component to load.

`RouterModule.forRoot` registers the routes into Angular.

To correctly load the routes in the page is used the `router-outlet`:

```angular2html
<div class="row">
  <div class="col-12 col-sm-10 col-md-10 col-sm-offset-1 col-md-offset-2">
    <router-outlet></router-outlet>
  </div>
</div>
```

---

## Set Up Navigation

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

Unfortunately in thi way the app is reloaded every time. 

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

---

## Navigation Path

The `routerLink` can have:

- **Absolute Path** - `routerLink="/path"`
  - in this case Angular will go to `/path` url.
- **Relative Path** - `routerLink="path"` or `routerLink="./path"`
  - in this case Angular will go to `current_path/path` url.
  - it is also possible user `routerLink="../path"` to move to `parent_path/path` url




