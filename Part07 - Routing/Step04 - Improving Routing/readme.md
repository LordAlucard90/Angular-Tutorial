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


