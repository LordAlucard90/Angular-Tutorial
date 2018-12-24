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


