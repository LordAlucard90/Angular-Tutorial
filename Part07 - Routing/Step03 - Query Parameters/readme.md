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

