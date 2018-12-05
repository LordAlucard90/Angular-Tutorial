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

Template examples:

```html
<p> {{'Server'}} with ID {{serverID}} is {{getServerState()}}. </p>
```
---


