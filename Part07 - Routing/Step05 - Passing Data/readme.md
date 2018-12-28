# Step 05 - Passing Data

## Static Data

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
---

## Dynamic Data

It is possible load data of a component after the component creation in the `ngOnInit` method or before it and pass it to the component route:

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

In this case the data is immediately resolved but it could be retrieved from a HTTP request.

---

## Location Strategies

All the routes are managed from Angular so on a real server not correctly configured will be raised a 404 page.

To avoid the 404 server page all the possible request must be directed to the index.html file that provide the Angular application.

if this is not possible there is the `hashtag` alternative:

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

With this option the server will only take care of the part before the hashtag and the Angular application will take care of the other part.