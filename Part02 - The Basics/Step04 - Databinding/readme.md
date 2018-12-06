# Step 04 - Databinding

## Databinding 

It is a method to allow the TypeScript Code (Business Logic) communicate with the Template (HTML).

There are some types of databinding:

- **Output Data**:
  - **String Interpolation** - `{{ data }}`
  - **Property Binding** - `[property]="data"`
- **React To (User) Events**:
  - **Event Binding** - `(event)="expression"`
- **Combination I/O**:
  - **Two-Way-Binding** - `[(ngModel)]="data`

---

## String Interpolation

For string interpolation is used the `{{ data }}` syntax.

Where data must be a string or everything could be converted to a string, like:

```typescript
serverID: number = 10;
serverStatus: string = 'offline';

getServerState(){
return this.serverStatus;
}
```

Template code:

```html
<p> {{'Server'}} with ID {{serverID}} is {{getServerState()}}. </p>
```
---

## Property Binding

For property binding is used the `[property]="data"` syntax.

Property binding allows Angular to update the template when a value from TypeScript change.

In this case after two seconds the **Add Server** button become enabled:
```typescript
export class ServersComponent implements OnInit {
  allowNewServers: boolean = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServers = true;
    }, 2000);
  }
}
```

Template code:
```angular2html
<button class="btn badge-primary" [disabled]="!allowNewServers">Add Server</button>
```