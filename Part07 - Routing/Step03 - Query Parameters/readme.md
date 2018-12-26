# Step 03 - Query Parameters

## Passing Params

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

It is possible made the same thing programmatically:

```typescript
export class HomeComponent implements OnInit {
  ...

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
---

## Retrieving Params

Like for `params`, it is possible for to get `queryParams` and `fragment` through **snapshot** or **subscribe**:

```typescript
console.log(this.activeRoute.snapshot.queryParams);
console.log(this.activeRoute.snapshot.fragment);
this.activeRoute.queryParams.subscribe();
this.activeRoute.fragment.subscribe();
```

---

## Params Conversion

By default the params retrieved are string, so ad `id` must be converted to a **number**:

```typescript
id = Number(this.activateRoute.snapshot.params['id'])
// or
id = +this.activateRoute.snapshot.params['id']
```

---

## Nested Routes

It is possible create nested routes:

```typescript
const appRoutes: Routes = [
  ...,
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

---

## Nested Routes Queries

By default, navigating from a component to another, as from a server to its edit page, will lose all the url params of the first:

```
/servers/1?allowEdit=1#loading -> /servers/1/edit
```

---

## Query Params Handling

Query Params Handling has some possible options:

- **merge** - merges the old query parameters with the new ones.
- **preserve** - keeps the old query parameters.

By default the behaviour is to drop the old query parameters.

```typescript
export class ServerComponent implements OnInit {
  ...

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
