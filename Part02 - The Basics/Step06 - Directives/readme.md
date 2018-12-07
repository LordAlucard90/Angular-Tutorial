## Step06 - Directives

Directives are Instructions in the DOM.

```angular2html
<p appTurnGreen>Receives a green background!</p>
```
This is a example directive that colors the text in green.

```typescript
@Directive({
    selector: '[appTurnGreen]'
})
export class TurnGreenDirective{
  ...
}
```

---

## *ngIF Directive

The ng directives needs the `*` to be recognised.

The `*ngIf="serverCreated"` insert or remove the element if the value or the function into the `"..."` is true or false.




